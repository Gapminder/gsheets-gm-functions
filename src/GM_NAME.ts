import { matchColumnValuesUsingGeoAliasesAndSynonyms } from "./gsheetsData/geoAliasesAndSynonyms";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 * Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".
 *
 * @param column_range_with_headers
 * @param geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param verbose Explains how a certain row is invalid instead of simply returning "[Invalid]" for the row
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_NAME(
  column_range_with_headers: string[][],
  geography: string,
  verbose: boolean
) {
  // Ensure expected input range contents
  const inputColumn = preProcessInputRangeWithHeaders(
    column_range_with_headers
  );

  // Default argument value
  if (verbose === undefined) {
    verbose = false;
  }

  // Drop the input range header row
  inputColumn.shift();

  const matchedGeos = matchColumnValuesUsingGeoAliasesAndSynonyms(
    inputColumn,
    geography
  );

  return [["name"]].concat(
    matchedGeos.map(matchedGeo => [
      matchedGeo.name
        ? matchedGeo.name
        : verbose
        ? `Unknown alias: ${matchedGeo.alias}`
        : "[Invalid]"
    ])
  );
}
