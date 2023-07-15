import { Validate, Value } from "../shared";

export interface AskArgs {
  prompt: string;
  fallback?: Value;
  errorTimeoutMS?: number;
  before?: Function;
  cast?: Function;
  validate?: Validate;
}

export interface SelectArgs {
  name: string;
  choices: Value[];
  fallback?: Value;
  errorTimeoutMS?: number;
  before?: Function;
}
