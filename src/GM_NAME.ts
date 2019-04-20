import { matchColumnValuesUsingGeoAliasesAndSynonyms } from "./gsheetsData/geoAliasesAndSynonyms";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 * Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".
 *
 * @param column_range_with_headers
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @param verbose (Optional with default "FALSE") Explains how a certain row is invalid instead of simply returning "[Invalid]" for the row
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_NAME(
  column_range_with_headers: string[][],
  geo_set: string,
  verbose: boolean
) {
  // Ensure expected input range contents
  const inputColumn = preProcessInputRangeWithHeaders(
    column_range_with_headers
  );

  // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
  const validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(geo_set);

  // Default argument value
  if (verbose === undefined) {
    verbose = false;
  }

  // Drop the input range header row
  inputColumn.shift();

  const matchedGeos = matchColumnValuesUsingGeoAliasesAndSynonyms(
    inputColumn,
    validatedGeoSetArgument
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
