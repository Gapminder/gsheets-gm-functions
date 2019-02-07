import parse from "csv-parse/lib/sync";

// Implement a minimal Utilities to be able to test outside of the google apps script environment

/**
 * @hidden
 */
export class MinimalUtilities {
  public static parseCsv(csv: string, delimiter: string = null): string[][] {
    return parse(csv, {
      columns: false,
      skip_empty_lines: true
    });
  }
}
