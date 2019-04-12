import { getConceptDataCatalogEntry } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";

/**
 * @hidden
 */
export function menuRefreshDataDependencies() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = activeSpreadsheet.getSheetByName("data-dependencies");

  const expectedFirstHeaders = [
    "concept_id",
    "time_unit",
    "geography",
    "catalog status"
  ];

  if (sheet === null) {
    sheet = activeSpreadsheet.insertSheet(
      "data-dependencies",
      activeSpreadsheet.getNumSheets()
    );
    sheet
      .getRange(1, 1, 1, expectedFirstHeaders.length)
      .setValues([expectedFirstHeaders]);
    SpreadsheetApp.getUi().alert(
      "No sheet named 'data-dependencies' was found. It has now been added. Please add your data dependencies to the sheet and run this again."
    );
    return;
  }

  const dataDependenciesWithHeaderRowRange = sheet.getRange(
    1,
    1,
    sheet.getDataRange().getNumRows(),
    expectedFirstHeaders.length
  );
  const dataDependenciesWithHeaderRow = dataDependenciesWithHeaderRowRange.getValues();

  // Verify that the first headers are as expected
  const headerRow = dataDependenciesWithHeaderRow.slice(0, 1);
  const firstHeaders = headerRow[0].slice(0, expectedFirstHeaders.length);
  if (JSON.stringify(firstHeaders) !== JSON.stringify(expectedFirstHeaders)) {
    SpreadsheetApp.getUi().alert(
      `The first column headers in 'data-dependencies' must be ${JSON.stringify(
        expectedFirstHeaders
      )} but are currently ${JSON.stringify(
        firstHeaders
      )}. Please adjust and try again`
    );
    return;
  }

  const dataDependencies = dataDependenciesWithHeaderRow.slice(1);

  const writeStatus = (index, { dataRows, lastChecked, notes }) => {
    const updatedRowValues = [dataRows, lastChecked, notes];
    const dataDependencyRow = 2 + index;
    sheet
      .getRange(
        dataDependencyRow,
        expectedFirstHeaders.length + 1,
        1,
        updatedRowValues.length
      )
      .setValues([updatedRowValues]);
  };

  // For each data dependency - copy the catalog data worksheet values to corresponding sheets in the current spreadsheet
  dataDependencies.map((dataDependencyRow, index) => {
    const concept_id = dataDependencyRow[0];
    const time_unit = dataDependencyRow[1];
    const geography = dataDependencyRow[2];
    const dataStatus = dataDependencyRow[3];

    // Do not attempt to import bad datasets
    if (dataStatus.toString().substr(0, 3) === "BAD") {
      writeStatus(index, {
        dataRows: null,
        lastChecked: null,
        notes: "Not imported since catalog status is marked as BAD"
      });
      return;
    }

    const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();

    const conceptDataCatalogEntry = getConceptDataCatalogEntry(
      concept_id,
      time_unit,
      geography,
      fasttrackCatalogDataPointsWorksheetData
    );

    const destinationSheetName = `data:${concept_id}:${time_unit}:${geography}`;

    // Import sheet from source document
    const sourceDoc = SpreadsheetApp.openById(conceptDataCatalogEntry.docId);
    const sourceSheet = sourceDoc.getSheetByName(
      conceptDataCatalogEntry.worksheetReference.name
    );
    if (!sourceSheet) {
      writeStatus(index, {
        dataRows: null,
        lastChecked: null,
        notes: `Not imported since the source sheet "${
          conceptDataCatalogEntry.worksheetReference.name
        }" was not available`
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
    writeStatus(index, {
      dataRows: null,
      lastChecked,
      notes: "About to import..."
    });

    // Remove existing imported data before import (we keep only 1x1 cell)
    if (destinationSheet.getMaxColumns() > 1) {
      destinationSheet.deleteColumns(1, destinationSheet.getMaxColumns() - 1);
    }
    if (destinationSheet.getMaxRows() > 1) {
      destinationSheet.deleteRows(1, destinationSheet.getMaxRows() - 1);
    }
    destinationSheet.getRange(1, 1, 1, 1).setValues([[null]]);

    // Import values
    const importValues = sourceSheet.getDataRange().getValues();
    const dataRows = importValues.length - 1;
    writeStatus(index, {
      dataRows,
      lastChecked,
      notes: "[Importing...] Cleared previously imported data"
    });

    // Write imported values
    destinationSheet.insertRows(1, importValues.length - 1);
    writeStatus(index, {
      dataRows,
      lastChecked,
      notes: "[Importing...] Inserted placeholder rows for the new data"
    });
    destinationSheet.insertColumns(1, importValues[0].length - 1);
    writeStatus(index, {
      dataRows,
      lastChecked,
      notes: "[Importing...] Inserted placeholder columns for the new data"
    });
    destinationSheet
      .getRange(
        1,
        1,
        destinationSheet.getMaxRows(),
        destinationSheet.getMaxColumns()
      )
      .setValues(importValues);
    writeStatus(index, {
      dataRows,
      lastChecked,
      notes: "Imported the data successfully"
    });
  });

  SpreadsheetApp.getUi().alert("Imported/refreshed data dependencies");

  return;
}
