import fs from "fs";
import path from "path";
import url from "url";

const projectDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const declarationFilesDirs = [
  `${projectDir}/types`,
  `${projectDir}/dist/types`
];
const outputFilePath = `${projectDir}/dist/index.d.ts`;

async function mergeDeclarationFiles() {
  try {
    const declarationFiles = await getDeclarationFiles(declarationFilesDirs);
    const mergedDeclarations = await readDeclarationFiles(declarationFiles);
    const mergedContent = mergedDeclarations.join("\n\n");
    await fs.promises.writeFile(outputFilePath, mergedContent);
    console.log("\nMerged declaration files");
  } catch (error) {
    console.error("Error merging declaration files:", error);
  }
}

async function getDeclarationFiles(dirs) {
  const declarationFiles = [];
  for (const dir of dirs) {
    await findDeclarationFiles(dir, declarationFiles);
  }
  return declarationFiles;
}

async function findDeclarationFiles(dir, declarationFiles) {
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await fs.promises.stat(filePath);
    if (fileStat.isDirectory()) {
      await findDeclarationFiles(filePath, declarationFiles);
    } else if (filePath.endsWith(".d.ts")) {
      declarationFiles.push(filePath);
    }
  }
}

async function readDeclarationFiles(files) {
  const exportedStatements = [];
  for (const file of files) {
    const fileContent = await fs.promises.readFile(file, "utf-8");
    const statements = extractStatements(fileContent);
    exportedStatements.push(...statements);
  }
  return exportedStatements;
}

function extractStatements(content) {
  const lines = content.split(/\r?\n/);
  const exportedStatements = [];
  let currentStatement = "";
  let braceCount = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      (trimmedLine.startsWith("export class") ||
        trimmedLine.startsWith("export interface") ||
        trimmedLine.startsWith("export type") ||
        trimmedLine.startsWith("export enum") ||
        trimmedLine.startsWith("export default")) &&
      braceCount === 0
    ) {
      if (currentStatement !== "") {
        exportedStatements.push(currentStatement);
      }
      currentStatement = removeDefaultKeyword(trimmedLine);
      if (trimmedLine.endsWith("{")) {
        braceCount++;
      }
    } else if (currentStatement !== "") {
      currentStatement += "\n" + line;
      braceCount += countOpeningBraces(line);
      braceCount -= countClosingBraces(line);

      if (braceCount === 0) {
        exportedStatements.push(currentStatement);
        currentStatement = "";
      }
    }
  }

  return exportedStatements.map((statement) => statement.trim()).filter(Boolean);
}

function removeDefaultKeyword(line) {
  return line.replace(/^export\s+default\s+/, "export ");
}

function countOpeningBraces(line) {
  const openingBraces = line.match(/{/g);
  return openingBraces ? openingBraces.length : 0;
}

function countClosingBraces(line) {
  const closingBraces = line.match(/}/g);
  return closingBraces ? closingBraces.length : 0;
}

await mergeDeclarationFiles();
