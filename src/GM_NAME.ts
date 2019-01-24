import { getGeoAliasesAndSynonymsLookupTable } from "./gsheetsData/geoAliasesAndSynonyms";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 *
 * @param column_range_with_headers
 * @param concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in this workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states )
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_NAME(
  column_range_with_headers: string[][],
  concept_id: string
) {
  // Ensure expected input range contents
  const inputColumn = preProcessInputRangeWithHeaders(
    column_range_with_headers
  );

  const lookupTable = getGeoAliasesAndSynonymsLookupTable(concept_id);

  // Drop the input range header row
  inputColumn.shift();

  const matchedData = inputColumn.map(inputRow => {
    const alias = inputRow[0];
    const result = lookupTable[alias];
    return [result ? result.name : `Unknown alias: ${alias}`];
  });

  return [["name"]].concat(matchedData);
}
