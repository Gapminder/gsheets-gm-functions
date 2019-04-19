import { getFasttrackCatalogDataPointsList } from "../gsheetsData/fastttrackCatalog";
import { getOpenNumbersDatasetConceptListing } from "../openNumbersData/opennumbersCatalog";
import {
  assertCorrectDataDependenciesSheetHeaders,
  createDataCatalogSheet,
  createDataDependenciesSheet,
  getDataDependenciesWithHeaderRow,
  implementDataDependenciesValidations,
  refreshDataCatalogSheet
} from "./dataDependenciesCommon";

/**
 * Menu item action for "Gapminder Data -> Refresh data catalog"
 *
 * Imports the data catalog from the fasttrack catalog to the current spreadsheet,
 * setting the relevant selectable options in the data-dependencies spreadsheet.
 *
 * Details:
 * - Creates the data-dependencies and data-catalog spreadsheets if they don't exist
 * - Verifies that the first headers of the data-dependencies spreadsheet are as expected
 */
export function menuRefreshDataCatalog() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let dataDependenciesSheet = activeSpreadsheet.getSheetByName(
    "data-dependencies"
  );
  if (dataDependenciesSheet === null) {
    dataDependenciesSheet = createDataDependenciesSheet(activeSpreadsheet);
  }

  let dataCatalogSheet = activeSpreadsheet.getSheetByName("data-catalog");
  if (dataCatalogSheet === null) {
    dataCatalogSheet = createDataCatalogSheet(activeSpreadsheet);
  }

  const dataDependenciesWithHeaderRow = getDataDependenciesWithHeaderRow(
    dataDependenciesSheet
  );

  // Verify that the first headers are as expected
  if (
    !assertCorrectDataDependenciesSheetHeaders(dataDependenciesWithHeaderRow)
  ) {
    return;
  }

  // Refresh data catalog
  const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();
  const openNumbersCatalogConceptListing = getOpenNumbersDatasetConceptListing(
    "ddf--open_numbers--world_development_indicators"
  );
  refreshDataCatalogSheet(
    dataCatalogSheet,
    fasttrackCatalogDataPointsWorksheetData,
    openNumbersCatalogConceptListing
  );
  implementDataDependenciesValidations(dataDependenciesSheet, dataCatalogSheet);

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
    'Refreshed data catalog. In the "data-dependencies" sheet\'s "Data reference" column, you are now able to select between the datasets listed in the Fasttrack catalog and the Open Numbers World Development Indicators.'
  );

  return;
}
