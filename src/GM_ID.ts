import { preProcessInputRangeWithHeaders } from "./cleanInputRange";
import { getGeoAliasesAndSynonymsLookupTable } from "./geoAliasesAndSynonyms";

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 *
 * @param column_range_with_headers
 * @param geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_ID(
  column_range_with_headers: string[][],
  geography: string
) {
  // Ensure expected input range contents
  const inputColumn = preProcessInputRangeWithHeaders(
    column_range_with_headers
  );

  const lookupTable = getGeoAliasesAndSynonymsLookupTable(geography);

  // Drop the input range header row
  inputColumn.shift();

  const matchedData = inputColumn.map(inputRow => {
    const alias = inputRow[0];
    const result = lookupTable[alias];
    return [result ? result.geo : `Unknown alias: ${alias}`];
  });

  return [["geo"]].concat(matchedData);
}
