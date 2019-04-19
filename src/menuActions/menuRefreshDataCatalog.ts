import { getFasttrackCatalogDataPointsList } from "../gsheetsData/fastttrackCatalog";
import {
  assertCorrectDataDependenciesSheetHeaders,
  createDataDependenciesSheet,
  getDataDependenciesWithHeaderRow,
  implementDataDependenciesSheetStylesFormulasAndValidations
} from "./dataDependenciesCommon";

/**
 * Menu item action for "Gapminder Data -> Refresh data catalog"
 *
 * Imports the data catalog from the fasttrack catalog to the current spreadsheet,
 * setting the relevant selectable options in the data-dependencies spreadsheet.
 *
 * Details:
 * - Creates the data-dependencies spreadsheet if it doesn't exist
 * - Verifies that the first headers of the data-dependencies spreadsheet are as expected
 */
export function menuRefreshDataCatalog() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = activeSpreadsheet.getSheetByName("data-dependencies");

  if (sheet === null) {
    sheet = createDataDependenciesSheet(activeSpreadsheet);
  }

  const dataDependenciesWithHeaderRow = getDataDependenciesWithHeaderRow(sheet);

  // Verify that the first headers are as expected
  if (
    !assertCorrectDataDependenciesSheetHeaders(dataDependenciesWithHeaderRow)
  ) {
    return;
  }

  // Refresh data catalog
  const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();
  implementDataDependenciesSheetStylesFormulasAndValidations(
    sheet,
    fasttrackCatalogDataPointsWorksheetData
  );

  // Read current data dependencies
  const dataDependencies = dataDependenciesWithHeaderRow.slice(1);

  // For each data dependency - insert GM_DATASET_CATALOG_STATUS if not already exists
  dataDependencies.map((dataDependencyRow, index) => {
    const dataset_reference = dataDependencyRow[0];
    const time_unit = dataDependencyRow[1];
    const geo_set = dataDependencyRow[2];
    const dataStatus = dataDependencyRow[3];
  });

  SpreadsheetApp.getUi().alert(
    "Refreshed data catalog. In the data reference column, you are now able to select between the datasets listed in the fasttrack catalog."
  );

  return;
}
