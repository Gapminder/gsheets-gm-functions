import { matchColumnValuesUsingGeoAliasesAndSynonyms } from "./gsheetsData/geoAliasesAndSynonyms";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 *
 * @param column_range_with_headers
 * @param geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_NAME(
  column_range_with_headers: string[][],
  geography: string
) {
  // Ensure expected input range contents
  const inputColumn = preProcessInputRangeWithHeaders(
    column_range_with_headers
  );

  // Drop the input range header row
  inputColumn.shift();

  const matchedGeos = matchColumnValuesUsingGeoAliasesAndSynonyms(
    inputColumn,
    geography
  );

  return [["name"]].concat(
    matchedGeos.map(matchedGeo => [
      matchedGeo.name ? matchedGeo.name : `Unknown alias: ${matchedGeo.alias}`
    ])
  );
}
