import { getConceptDataWorksheetData } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";
import { ConceptDataRow } from "./lib/conceptDataRow";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Imports a standard Gapminder concept table.
 *
 * Note that using data dependencies in combination with the QUERY() function instead of GM_IMPORT_SLOW() is the only performant way to include concept data in a spreadsheet.
 *
 * Takes 2-4 seconds:
 * =GM_IMPORT_SLOW("pop", "year", "global")
 *
 * Almost instant:
 * =QUERY('data:pop:year:global'!A1:D)
 *
 * Always yields "Error: Result too large" since the "countries_etc" version of the dataset is rather large:
 * =GM_IMPORT_SLOW("pop", "year", "countries_etc")
 *
 * Finishes in 3-10 seconds:
 * =QUERY('data:pop:year:countries_etc'!A1:D)
 *
 * @param concept_id Concept id (eg. "pop") of which concept to import
 * @param time_unit Time unit variant (eg. "year") of the concept to import
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_IMPORT_SLOW(
  concept_id: string,
  time_unit: string,
  geo_set: string
) {
  // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
  validateAndAliasTheGeoSetArgument(geo_set);

  const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();
  const importedWorksheetData = getConceptDataWorksheetData(
    concept_id,
    time_unit,
    geo_set,
    fasttrackCatalogDataPointsWorksheetData
  );
  const importedData = importedWorksheetData.rows.map((row: ConceptDataRow) => {
    return [row.geo, row.name, row.time, row.value];
  });
  return [["geo", "name", time_unit, concept_id]].concat(importedData);
}
