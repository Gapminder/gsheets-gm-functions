import { getConceptDataFasttrackCatalogEntry } from "../gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "../gsheetsData/fastttrackCatalog";
import { ConceptDataRow, ConceptDataWorksheetData } from "../lib/conceptData";
import { validateAndAliasTheGeoSetArgument } from "../lib/validateAndAliasTheGeoSetArgument";
import { validateConceptIdArgument } from "../lib/validateConceptIdArgument";
import { getOpenNumbersConceptData } from "../openNumbersData/conceptData";
import { getOpenNumbersDatasetConceptListing } from "../openNumbersData/openNumbersDataset";
import {
  assertCorrectDataDependenciesSheetHeaders,
  createDataCatalogSheet,
  createDataDependenciesSheet,
  getDataDependenciesWithHeaderRow,
  implementDataDependenciesValidations,
  refreshDataCatalogSheet,
  writeStatus
} from "./dataDependenciesCommon";

/**
 * Menu item action for "Gapminder Data -> Import/refresh data dependencies"
 *
 * Imports data sets from the fasttrack catalog to the current spreadsheet,
 * allowing GM_-functions to reference local data instead of importing data on-the-fly.
 *
 * Details:
 * - Creates the data-dependencies and data-catalog spreadsheets if they don't exist
 * - Verifies that the first headers of the data-dependencies spreadsheet are as expected
 * - Does not attempt to import data with bad catalog status
 * - Communicates import status as the import progresses
 */
export function menuRefreshDataDependencies() {
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
  const openNumbersWorldDevelopmentIndicatorsDatasetConceptListing = getOpenNumbersDatasetConceptListing(
    "ddf--open_numbers--world_development_indicators"
  );
  refreshDataCatalogSheet(
    dataCatalogSheet,
    fasttrackCatalogDataPointsWorksheetData,
    openNumbersWorldDevelopmentIndicatorsDatasetConceptListing
  );
  implementDataDependenciesValidations(dataDependenciesSheet, dataCatalogSheet);

  // Read current data dependencies
  const dataDependencies = dataDependenciesWithHeaderRow.slice(1);

  // For each data dependency - copy the catalog data worksheet values to corresponding sheets in the current spreadsheet
  dataDependencies.map((dataDependencyRow, index) => {
    const dataset_reference: string = String(dataDependencyRow[0]);
    const time_unit = dataDependencyRow[1];
    const geo_set = dataDependencyRow[2];
    const dataStatus = dataDependencyRow[3];

    // Skip empty rows
    if (dataset_reference === "") {
      return;
    }

    const parsedDatasetReference = dataset_reference.split("@");
    const concept_id = parsedDatasetReference[0];

    try {
      validateConceptIdArgument(concept_id);
      const validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(
        geo_set
      );
    } catch (err) {
      writeStatus(dataDependenciesSheet, index, {
        importRangeRows: null,
        lastChecked: null,
        notes: "Not imported: " + err.message
      });
      return;
    }

    // Do not attempt to import bad datasets
    if (dataStatus.toString().substr(0, 3) === "BAD") {
      writeStatus(dataDependenciesSheet, index, {
        importRangeRows: null,
        lastChecked: null,
        notes: "Not checked/imported since catalog status is marked as BAD"
      });
      return;
    }

    const destinationSheetName = `data:${dataset_reference}:${time_unit}:${geo_set}`;

    // Read values to import
    const catalog = parsedDatasetReference[1];
    let importValues;
    let importRangeRows;
    let importRangeColumns;
    switch (catalog) {
      case undefined:
      case "":
      case "fasttrack":
        {
          const conceptDataFasttrackCatalogEntry = getConceptDataFasttrackCatalogEntry(
            concept_id,
            time_unit,
            geo_set,
            fasttrackCatalogDataPointsWorksheetData
          );

          // Import sheet from source document
          const sourceDoc = SpreadsheetApp.openById(
            conceptDataFasttrackCatalogEntry.docId
          );
          const sourceSheet = sourceDoc.getSheetByName(
            conceptDataFasttrackCatalogEntry.worksheetReference.name
          );
          if (!sourceSheet) {
            writeStatus(dataDependenciesSheet, index, {
              importRangeRows: null,
              lastChecked: null,
              notes: `Not imported since the source sheet "${
                conceptDataFasttrackCatalogEntry.worksheetReference.name
              }" was not available`
            });
            return;
          }

          const sourceDataRange = sourceSheet.getDataRange();
          importValues = sourceDataRange.getValues();
          importRangeRows = sourceDataRange.getNumRows();
          importRangeColumns = sourceDataRange.getNumColumns();
        }
        break;
      case "open-numbers-wdi":
      case "open-numbers/ddf--open_numbers--world_development_indicators":
        {
          const openNumbersConceptData: ConceptDataWorksheetData = getOpenNumbersConceptData(
            concept_id,
            time_unit,
            geo_set,
            openNumbersWorldDevelopmentIndicatorsDatasetConceptListing
          );
          importValues = [openNumbersConceptData.headers].concat(
            openNumbersConceptData.rows.map(
              (conceptDataRow: ConceptDataRow) => {
                return [
                  conceptDataRow.geo,
                  conceptDataRow.name,
                  conceptDataRow.time,
                  conceptDataRow.value
                ];
              }
            )
          );
          importRangeRows = importValues.length;
          importRangeColumns = 4;
        }
        break;
      default: {
        writeStatus(dataDependenciesSheet, index, {
          importRangeRows: null,
          lastChecked: null,
          notes: `Not imported - unknown catalog: "${catalog}"`
        });
        return;
      }
    }

    const lastChecked = new Date();

    // Do not import empty data sets
    if (importRangeRows <= 1) {
      writeStatus(dataDependenciesSheet, index, {
        importRangeRows,
        lastChecked,
        notes: `Not imported since no data rows to import were found`
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

    writeStatus(dataDependenciesSheet, index, {
      importRangeRows,
      lastChecked,
      notes: "About to import..."
    });

    // Remove excess rows and columns in case the import data range is smaller than the previously imported data range
    // This prevents stale data from lingering around after the import
    if (destinationSheet.getMaxRows() > importRangeRows) {
      destinationSheet.deleteRows(
        importRangeRows,
        destinationSheet.getMaxRows() - importRangeRows
      );
    }
    if (destinationSheet.getMaxColumns() > importRangeColumns) {
      destinationSheet.deleteColumns(
        importRangeColumns,
        destinationSheet.getMaxColumns() - importRangeColumns
      );
    }
    // Insert new rows if the existing range is smaller than the import data range
    if (destinationSheet.getMaxRows() < importRangeRows) {
      destinationSheet.insertRows(
        destinationSheet.getMaxRows(),
        importRangeRows - destinationSheet.getMaxRows()
      );
    }
    if (destinationSheet.getMaxColumns() < importRangeColumns) {
      destinationSheet.insertColumns(
        destinationSheet.getMaxColumns(),
        importRangeColumns - destinationSheet.getMaxColumns()
      );
    }
    writeStatus(dataDependenciesSheet, index, {
      importRangeRows,
      lastChecked,
      notes:
        "[Importing...] Adjusted destination sheet rows and columns to accommodate the new data"
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
    writeStatus(dataDependenciesSheet, index, {
      importRangeRows,
      lastChecked,
      notes: "Imported the data successfully"
    });
  });

  SpreadsheetApp.getUi().alert("Imported/refreshed data dependencies");

  return;
}
