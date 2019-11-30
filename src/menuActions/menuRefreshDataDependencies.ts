import { getValidConceptDataFasttrackCatalogEntry } from "../gsheetsData/conceptData";
import { ConceptDataRow, ConceptDataWorksheetData } from "../lib/conceptData";
import { parseConceptIdAndCatalogReference } from "../lib/parseConceptIdAndCatalogReference";
import { validateAndAliasTheGeoSetArgument } from "../lib/validateAndAliasTheGeoSetArgument";
import { validateConceptIdArgument } from "../lib/validateConceptIdArgument";
import { getOpenNumbersConceptData } from "../openNumbersData/conceptData";
import {
  adjustSheetRowsAndColumnsCount,
  refreshDataCatalog,
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

  const {
    dataDependenciesSheet,
    dataDependenciesWithHeaderRow,
    fasttrackCatalogDataPointsWorksheetData,
    openNumbersWorldDevelopmentIndicatorsDatasetConceptListing
  } = refreshDataCatalog(activeSpreadsheet);

  // Read current data dependencies
  const dataDependencies = dataDependenciesWithHeaderRow.slice(1);

  // Do not attempt to import if there are no data dependencies
  if (dataDependencies.length === 0) {
    SpreadsheetApp.getUi().alert(
      "Please add your data dependencies to the 'data-dependencies' sheet, then run this again."
    );
    return;
  }

  // For each data dependency - copy the catalog data worksheet values to corresponding sheets in the current spreadsheet
  dataDependencies.map((dataDependencyRow, index) => {
    const concept_id_and_catalog_reference: string = String(
      dataDependencyRow[0]
    );
    const time_unit = dataDependencyRow[1];
    const geo_set = dataDependencyRow[2];
    const dataStatus = dataDependencyRow[3];

    // Skip empty rows
    if (concept_id_and_catalog_reference === "") {
      return;
    }

    const {
      conceptId,
      conceptVersion,
      catalog
    } = parseConceptIdAndCatalogReference(concept_id_and_catalog_reference);

    let validatedGeoSetArgument;
    try {
      validateConceptIdArgument(conceptId);
      validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(geo_set);
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

    const destinationSheetName = `data:${concept_id_and_catalog_reference}:${time_unit}:${validatedGeoSetArgument}`;

    // Read values to import
    let importValues;
    let importRangeRows;
    let importRangeColumns;
    switch (catalog) {
      case undefined:
      case "":
      case "fasttrack":
        {
          const conceptDataFasttrackCatalogEntry = getValidConceptDataFasttrackCatalogEntry(
            conceptId,
            time_unit,
            validatedGeoSetArgument,
            fasttrackCatalogDataPointsWorksheetData
          );

          // Import sheet from source document
          let sourceDoc = SpreadsheetApp.openById(
            conceptDataFasttrackCatalogEntry.docId
          );
          // Fetch specific version
          if (conceptVersion) {
            const versionCellNamedRange = sourceDoc.getRangeByName("version");
            if (!versionCellNamedRange) {
              writeStatus(dataDependenciesSheet, index, {
                importRangeRows: null,
                lastChecked: null,
                notes: `Not imported since there was no "version" named range in the source doc ("${
                  conceptDataFasttrackCatalogEntry.docId
                }")`
              });
              return;
            }
            const currentVersion = versionCellNamedRange.getValue();
            if (conceptVersion !== currentVersion) {
              const versionsTableRange = sourceDoc.getRangeByName(
                "version_table"
              );
              if (!versionsTableRange) {
                writeStatus(dataDependenciesSheet, index, {
                  importRangeRows: null,
                  lastChecked: null,
                  notes: `Not imported since there was no "version_table" named range in the source doc ("${sourceDoc.getUrl()}")`
                });
                return;
              }
              const versionsTableValues = versionsTableRange.getValues() as string[][];
              const matchingVersionTableRows = versionsTableValues.filter(
                (versionsTableRow, i) => {
                  return versionsTableRow[0] === conceptVersion;
                }
              );
              const matchingVersionTableRow = matchingVersionTableRows[0];
              if (!matchingVersionTableRow) {
                writeStatus(dataDependenciesSheet, index, {
                  importRangeRows: null,
                  lastChecked: null,
                  notes: `Not imported since the requested version ("${conceptVersion}") was not listed in the "version_table" named range in the source doc ("${sourceDoc.getUrl()}")`
                });
                return;
              }
              const link = matchingVersionTableRow[1];
              if (!link || link.trim() === "" || link.trim() === "-") {
                writeStatus(dataDependenciesSheet, index, {
                  importRangeRows: null,
                  lastChecked: null,
                  notes: `Not imported since the requested version ("${conceptVersion}") entry had an empty "Link" value in the "version_table" named range in the source doc ("${sourceDoc.getUrl()}")`
                });
                return;
              }
              try {
                sourceDoc = SpreadsheetApp.openByUrl(link);
              } catch (e) {
                writeStatus(dataDependenciesSheet, index, {
                  importRangeRows: null,
                  lastChecked: null,
                  notes: `Not imported since there was a problem with opening the requested version ("${conceptVersion}"). The "Link" value was "${link}" for this version in the "version_table" named range in the source doc ("${sourceDoc.getUrl()}") and the error message was ${e.toString()}`
                });
                return;
              }
            }
          }
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

          // Import the relevant concept data
          const sourceDataRange = sourceSheet.getDataRange();
          const sourceValues = sourceDataRange.getValues();
          importValues = sourceValues.map(row => [
            row[0], // geo
            row[1], // name
            row[2], // time
            row[2 + conceptDataFasttrackCatalogEntry.indicatorOrder] // the concept data column to import
          ]);
          importRangeRows = sourceDataRange.getNumRows();
          importRangeColumns = 4;
        }
        break;
      case "open-numbers-wdi":
      case "open-numbers/ddf--open_numbers--world_development_indicators":
        {
          const openNumbersConceptData: ConceptDataWorksheetData = getOpenNumbersConceptData(
            conceptId,
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

    // Remove excess rows and columns in case the import data range is smaller than the previously imported data range and vice versa
    // This prevents stale data from lingering around after the import
    adjustSheetRowsAndColumnsCount(
      destinationSheet,
      importRangeRows,
      importRangeColumns
    );

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

  SpreadsheetApp.getUi().alert("Imported/refreshed data dependencies.");

  return;
}
