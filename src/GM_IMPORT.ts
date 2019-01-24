import { getFasttrackCatalogDataPointsList } from "./fastttrackCatalog";

/**
 * Imports a standard Gapminder concept table.
 *
 * @param concept_id Concept id (eg. "pop") of which concept to import
 * @param time_unit Time unit variant (eg. "year") of the concept to import
 * @param geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_IMPORT(
  concept_id: string,
  time_unit: string,
  geography: string
) {
  const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();
  const importedData = fasttrackCatalogDataPointsWorksheetData.rows.map(row => {
    return ["foo"];
  });

  return [["Foo"]].concat(importedData);
}
