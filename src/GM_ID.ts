import { getGeoAliasesAndSynonymsLookupTable } from "./geoAliasesAndSynonyms";

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 *
 * @param column_range_with_headers
 * @param concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in the "geo aliases and synonyms" workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states ) TODO: Make optional
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_ID(
  column_range_with_headers: string[][],
  concept_id: string
) {
  const lookupTable = getGeoAliasesAndSynonymsLookupTable(concept_id);

  // Drop the input range header row
  column_range_with_headers.shift();

  const matchedData = column_range_with_headers.map(inputRow => {
    const alias = inputRow[0];
    const result = lookupTable[alias];
    return [result ? result.geo : `Unknown alias: ${alias}`];
  });

  return [["geo"]].concat(matchedData);
}
