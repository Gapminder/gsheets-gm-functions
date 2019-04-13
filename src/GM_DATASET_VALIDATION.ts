import { getConceptDataCatalogEntry } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";

/**
 * Evaluates if the referenced dataset ranges are set up according to the standard format and complete:
 * - Checks the row header of the output sheets (the so called "data-countries-etc/world/region-by-year)
 * - Checks the about sheet (to see if it follows the requirements in col A of the template)
 * Returns "GOOD" or "BAD: What is bad... ".
 *
 * @param about_sheet_range_except_the_title_row Local spreadsheet range referencing the ABOUT sheet contents except the header row (where this function is expected to be used).
 * @param data_for_world_by_year_sheet_range Local spreadsheet range referencing the "world-by-year" concept data sheet.
 * @param data_for_regions_by_year_sheet_range Local spreadsheet range referencing the "regions-by-year" concept data sheet.
 * @param data_for_countries_etc_by_year_range_sheet_range Local spreadsheet range referencing the "countries-etc-by-year" concept data sheet.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATASET_VALIDATION(
  about_sheet_range_except_the_title_row: string[][],
  data_for_world_by_year_sheet_range: string[][],
  data_for_regions_by_year_sheet_range: string[][],
  data_for_countries_etc_by_year_range_sheet_range: string[][]
) {
  try {
    return [["TODO: GM_DATASET_VALIDATION"]];
  } catch (err) {
    return [["BAD: " + err.message]];
  }
}
