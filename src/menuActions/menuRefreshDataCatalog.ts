import { refreshDataCatalog } from "./dataDependenciesCommon";

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

  refreshDataCatalog(activeSpreadsheet);

  SpreadsheetApp.getUi().alert(
    'Refreshed data catalog. In the "data-dependencies" sheet\'s "Data reference" column, you are now able to select between the datasets listed in the Fasttrack catalog and the Open Numbers World Development Indicators.'
  );

  return;
}
