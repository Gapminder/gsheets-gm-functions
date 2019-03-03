import { getConceptDataWorksheetMetadata } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";

/**
 * @hidden
 */
export function menuRefreshDataDependencies() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "data-dependencies"
  );

  if (sheet === null) {
    SpreadsheetApp.getUi().alert(
      "No sheet named 'data-dependencies'. Please add one"
    );
    return;
  }

  const dataDependenciesRangeValues = sheet.getDataRange().getValues();

  // For each data dependency - copy the catalog data worksheet values to corresponding sheets in the current spreadsheet
  dataDependenciesRangeValues.shift();
  dataDependenciesRangeValues.map(dataDependencyRow => {
    const concept_id = dataDependencyRow[0];
    const time_unit = dataDependencyRow[1];
    const geography = dataDependencyRow[2];

    const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();

    const conceptDataWorksheetMetadata = getConceptDataWorksheetMetadata(
      concept_id,
      time_unit,
      geography,
      fasttrackCatalogDataPointsWorksheetData
    );

    const destinationSheetName = `data:${concept_id}:${time_unit}:${geography}`;

    // Import sheet from source document
    const sourceDoc = SpreadsheetApp.openById(
      conceptDataWorksheetMetadata.docId
    );
    const sourceSheet = sourceDoc.getSheetByName(
      conceptDataWorksheetMetadata.worksheetReference.name
    );

    // Make sure that the destination sheet exists
    const destination = SpreadsheetApp.getActiveSpreadsheet();
    let destinationSheet = destination.getSheetByName(destinationSheetName);
    if (!destinationSheet) {
      destinationSheet = destination.insertSheet(
        destinationSheetName,
        destination.getNumSheets()
      );
    }

    // Remove existing imported data before import (we keep only 1x1 cell)
    destinationSheet.deleteColumns(1, destinationSheet.getMaxColumns() - 1);
    destinationSheet.deleteRows(1, destinationSheet.getMaxRows() - 1);

    // Import values
    const importValues = sourceSheet.getDataRange().getValues();
    destinationSheet.insertRows(1, importValues.length - 1);
    destinationSheet.insertColumns(1, importValues[0].length - 1);
    destinationSheet
      .getRange(
        1,
        1,
        destinationSheet.getMaxRows(),
        destinationSheet.getMaxColumns()
      )
      .setValues(importValues);
  });

  SpreadsheetApp.getUi().alert("Imported/refreshed data dependencies");

  return;
}
