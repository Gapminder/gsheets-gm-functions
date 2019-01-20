import { getGeoAliasesAndSynonymsCountriesEtcLookupTable } from "./geoAliasesAndSynonyms";

/**
 * Inserts a column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 *
 * @param column_range_with_headers
 * @param concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in this workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states ) TODO: Make optional
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_NAME(
  column_range_with_headers: string[][],
  concept_id: string
) {
  const lookupTable = getGeoAliasesAndSynonymsCountriesEtcLookupTable();

  // Drop the input range header row
  column_range_with_headers.shift();

  const matchedData = column_range_with_headers.map(inputRow => {
    const alias = inputRow[0];
    const result = lookupTable[alias];
    return [result ? result.name : `Unknown alias: ${alias}`];
  });

  return [["name"]].concat(matchedData);
}
