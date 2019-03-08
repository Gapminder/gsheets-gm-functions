import { matchColumnValuesUsingGeoAliasesAndSynonyms } from "./gsheetsData/geoAliasesAndSynonyms";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 * Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".
 *
 * @param column_range_with_headers
 * @param geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param verbose Explains how a certain row is invalid instead of simply returning "[Invalid]" for the row
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_ID(
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

  return [["geo"]].concat(
    matchedGeos.map(matchedGeo => [
      matchedGeo.geo
        ? matchedGeo.geo
        : verbose
        ? `Unknown alias: ${matchedGeo.alias}`
        : "[Invalid]"
    ])
  );
}
