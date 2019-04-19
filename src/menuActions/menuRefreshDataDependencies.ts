import { getConceptDataCatalogEntry } from "../gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "../gsheetsData/fastttrackCatalog";
import { validateAndAliasTheGeoSetArgument } from "../lib/validateAndAliasTheGeoSetArgument";
import {
  assertCorrectDataDependenciesSheetHeaders,
  createDataDependenciesSheet,
  getDataDependenciesWithHeaderRow,
  implementDataDependenciesSheetStylesFormulasAndValidations,
  writeStatus
} from "./dataDependenciesCommon";

/**
 * Menu item action for "Gapminder Data -> Import/refresh data dependencies"
 *
 * Imports data sets from the fasttrack catalog to the current spreadsheet,
 * allowing GM_-functions to reference local data instead of importing data on-the-fly.
 *
 * Details:
 * - Creates the data-dependencies spreadsheet if it doesn't exist
 * - Verifies that the first headers of the data-dependencies spreadsheet are as expected
 * - Does not attempt to import data with bad catalog status
 * - Communicates import status as the import progresses
 */
export function menuRefreshDataDependencies() {
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

  const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();

  // Refresh data catalog
  implementDataDependenciesSheetStylesFormulasAndValidations(
    sheet,
    fasttrackCatalogDataPointsWorksheetData
  );

  // Read current data dependencies
  const dataDependencies = dataDependenciesWithHeaderRow.slice(1);

  // For each data dependency - copy the catalog data worksheet values to corresponding sheets in the current spreadsheet
  dataDependencies.map((dataDependencyRow, index) => {
    const dataset_reference: string = String(dataDependencyRow[0]);
    const time_unit = dataDependencyRow[1];
    const geo_set = dataDependencyRow[2];
    const dataStatus = dataDependencyRow[3];

    try {
      validateAndAliasTheGeoSetArgument(geo_set);
    } catch (err) {
      writeStatus(sheet, index, {
        lastChecked: null,
        notes: "Not imported: " + err.message,
        sourceDataRows: null
      });
      return;
    }

    // Do not attempt to import bad datasets
    if (dataStatus.toString().substr(0, 3) === "BAD") {
      writeStatus(sheet, index, {
        lastChecked: null,
        notes: "Not checked/imported since catalog status is marked as BAD",
        sourceDataRows: null
      });
      return;
    }

    const parsedDatasetReference = dataset_reference.split("@");
    const concept_id = parsedDatasetReference[0];

    const conceptDataCatalogEntry = getConceptDataCatalogEntry(
      concept_id,
      time_unit,
      geo_set,
      fasttrackCatalogDataPointsWorksheetData
    );

    const destinationSheetName = `data:${concept_id}:${time_unit}:${geo_set}`;

    // Import sheet from source document
    const sourceDoc = SpreadsheetApp.openById(conceptDataCatalogEntry.docId);
    const sourceSheet = sourceDoc.getSheetByName(
      conceptDataCatalogEntry.worksheetReference.name
    );
    if (!sourceSheet) {
      writeStatus(sheet, index, {
        lastChecked: null,
        notes: `Not imported since the source sheet "${
          conceptDataCatalogEntry.worksheetReference.name
        }" was not available`,
        sourceDataRows: null
      });
      return;
    }

    // Make sure that the destination sheet exists
    const destination = activeSpreadsheet;
    let destinationSheet = destination.getSheetByName(destinationSheetName);
    if (!destinationSheet) {
      destinationSheet = destination.insertSheet(
        destinationSheetName,
        destination.getNumSheets()
      );
    }

    const lastChecked = new Date();
    writeStatus(sheet, index, {
      lastChecked,
      notes: "About to import...",
      sourceDataRows: null
    });

    // Read values to import
    const sourceDataRange = sourceSheet.getDataRange();
    const importValues = sourceDataRange.getValues();
    const sourceDataRows = sourceDataRange.getNumRows();
    const sourceDataColumns = sourceDataRange.getNumColumns();

    // Remove excess rows and columns in case the import data range is smaller than the previously imported data range
    // This prevents stale data from lingering around after the import
    if (destinationSheet.getMaxRows() > sourceDataRows) {
      destinationSheet.deleteRows(
        sourceDataRows,
        destinationSheet.getMaxRows() - sourceDataRows
      );
    }
    if (destinationSheet.getMaxColumns() > sourceDataColumns) {
      destinationSheet.deleteColumns(
        sourceDataColumns,
        destinationSheet.getMaxColumns() - sourceDataColumns
      );
    }
    // Insert new rows if the existing range is smaller than the import data range
    if (destinationSheet.getMaxRows() < sourceDataRows) {
      destinationSheet.insertRows(
        destinationSheet.getMaxRows(),
        sourceDataRows - destinationSheet.getMaxRows()
      );
    }
    if (destinationSheet.getMaxColumns() < sourceDataColumns) {
      destinationSheet.insertColumns(
        destinationSheet.getMaxColumns(),
        sourceDataColumns - destinationSheet.getMaxColumns()
      );
    }
    writeStatus(sheet, index, {
      lastChecked,
      notes:
        "[Importing...] Adjusted destination sheet rows and columns to accommodate the new data",
      sourceDataRows
    });

    // Write values to import
    destinationSheet
      .getRange(
        1,
        1,
        destinationSheet.getMaxRows(),
        destinationSheet.getMaxColumns()
      )
      .setValues(importValues);
    writeStatus(sheet, index, {
      lastChecked,
      notes: "Imported the data successfully",
      sourceDataRows
    });
  });

  SpreadsheetApp.getUi().alert("Imported/refreshed data dependencies");

  return;
}
