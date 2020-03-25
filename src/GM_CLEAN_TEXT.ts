import { keyNormalizerForSlightlyFuzzyLookups } from "./gsheetsData/keyNormalizerForSlightlyFuzzyLookups";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Converts to lowercase, then removes diacritics and any special characters outside of "[^a-z0-9 ()]".
 * Use for fuzzy matching such as "Foo " == "foo" and "Fóo*" == "Foo".
 *
 * @param range_with_headers
 * @return An array containing the cell/column contents described above in the summary.
 */
export function GM_CLEAN_TEXT(range_with_headers: string[][]) {
  // Ensure expected input range contents
  const inputColumn = preProcessInputRangeWithHeaders(range_with_headers);

  // Clean the input column
  const cleanHeaders = inputColumn.shift().map(header => `${header} (clean)`);
  const cleanInputColumn = inputColumn.map(row =>
    row.map(keyNormalizerForSlightlyFuzzyLookups)
  );
  return [cleanHeaders].concat(cleanInputColumn);
}
