declare module "papaparse" {
  export type ParseError = {
    message: string;
    code?: string;
    row?: number;
  };

  export type ParseMeta = Record<string, unknown>;

  export type ParseResult<T> = {
    data: T[];
    errors: ParseError[];
    meta: ParseMeta;
  };

  export type ParseConfig<T> = {
    header?: boolean;
    skipEmptyLines?: boolean;
    complete?: (results: ParseResult<T>) => void;
    error?: (error: Error) => void;
  };

  export function parse<T>(file: File | string, config: ParseConfig<T>): void;

  const Papa: {
    parse: typeof parse;
  };

  export default Papa;
}

