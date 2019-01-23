import { getGeoAliasesAndSynonymsLookupTable } from "./geoAliasesAndSynonyms";

/**
 * Imports a standard Gapminder concept table.
 *
 * @param concept_id Concept id (eg. "pop") of which concept to import
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_IMPORT(concept_id: string) {
  const lookupTable = getGeoAliasesAndSynonymsLookupTable(concept_id);

  const importedData = [].map(lookup => {
    return ["foo"];
  });

  return [["Foo"]].concat(importedData);
}
