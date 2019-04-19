import {
  FasttrackCatalogDataPointsDataRow,
  FasttrackCatalogDataPointsWorksheetData,
  getFasttrackCatalogDataPointsList
} from "../gsheetsData/fastttrackCatalog";
import { geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet } from "../gsheetsData/hardcodedConstants";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import { OpenNumbersDatasetConceptListingDataRow } from "../openNumbersData/opennumbersCatalog";

/**
 * @hidden
 */
const dataDependenciesHeaders = [
  "Dataset reference",
  "Time unit",
  "Geo set",
  "Catalog status",
  "Data rows",
  "Last checked",
  "Import notes"
];

/**
 * @hidden
 */
const dataCatalogHeaders = [
  "Dataset reference",
  "Concept ID",
  "Concept Name",
  "CSV"
];

/**
 * @hidden
 */
export const ensuredColumnIndex = (header: string) => {
  const index = dataDependenciesHeaders.indexOf(header);
  if (index < 0) {
    throw new Error(`Header not found: '${header}'`);
  }
  return index;
};

/**
 * @hidden
 */
export function writeStatus(
  sheet,
  index,
  { lastChecked, notes, sourceDataRows }
) {
  const dataRowsColumnIndex = ensuredColumnIndex("Data rows");
  const updatedRowValues = [sourceDataRows, lastChecked, notes];
  const dataDependencyRow = 2 + index;
  sheet
    .getRange(
      dataDependencyRow,
      dataRowsColumnIndex + 1,
      1,
      updatedRowValues.length
    )
    .setValues([updatedRowValues]);
}

/**
 * @hidden
 */
export function createDataDependenciesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(
    "data-dependencies",
    spreadsheet.getNumSheets()
  );
  const headersRange = sheet.getRange(1, 1, 1, dataDependenciesHeaders.length);
  headersRange.setValues([dataDependenciesHeaders]);
  headersRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert(
    "No sheet named 'data-dependencies' was found. It has now been added. Please add your data dependencies to the sheet and run this again."
  );
  return sheet;
}

/**
 * @hidden
 */
export function createDataCatalogSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(
    "data-catalog",
    spreadsheet.getNumSheets()
  );
  const headersRange = sheet.getRange(1, 1, 1, dataCatalogHeaders.length);
  headersRange.setValues([dataCatalogHeaders]);
  headersRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert(
    "No sheet named 'data-catalog' was found. It has now been added."
  );
  return sheet;
}

/**
 * @hidden
 */
export function getDataDependenciesWithHeaderRow(sheet: Sheet) {
  const dataDependenciesWithHeaderRowRange = sheet.getRange(
    1,
    1,
    sheet.getDataRange().getNumRows(),
    dataDependenciesHeaders.length
  );

  return dataDependenciesWithHeaderRowRange.getValues();
}

/**
 * @hidden
 */
export function assertCorrectDataDependenciesSheetHeaders(
  dataDependenciesWithHeaderRow
) {
  const headerRow = dataDependenciesWithHeaderRow.slice(0, 1);
  const firstHeaders = headerRow[0].slice(0, dataDependenciesHeaders.length);
  if (
    JSON.stringify(firstHeaders) !== JSON.stringify(dataDependenciesHeaders)
  ) {
    SpreadsheetApp.getUi().alert(
      `The first column headers in 'data-dependencies' must be ${JSON.stringify(
        dataDependenciesHeaders
      )} but are currently ${JSON.stringify(
        firstHeaders
      )}. Please adjust and try again`
    );
    return false;
  }
  return true;
}

/**
 * @hidden
 */
export function refreshDataCatalogSheet(
  sheet,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData,
  openNumbersCatalogConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  const fasttrackCatalogValues = fasttrackCatalogDataPointsWorksheetData.rows.map(
    (row: FasttrackCatalogDataPointsDataRow) => {
      return [
        `${row.concept_id}@fasttrack`,
        row.concept_id,
        row.concept_name,
        row.csv_link
      ];
    }
  );
  const opennumbersCatalogValues = openNumbersCatalogConceptListing.map(
    (row: OpenNumbersDatasetConceptListingDataRow) => {
      return [
        `${row.concept_id}@open-numbers-wdi`,
        row.concept_id,
        row.concept_name,
        row.csv_link
      ];
    }
  );
  const dataCatalogValues = [dataCatalogHeaders].concat(
    fasttrackCatalogValues,
    opennumbersCatalogValues
  );
  sheet
    .getRange(1, 1, dataCatalogValues.length, dataCatalogHeaders.length)
    .setValues(dataCatalogValues);
}

/**
 * @hidden
 */
export function implementDataDependenciesValidations(
  dataDependenciesSheet: Sheet,
  dataCatalogSheet: Sheet
) {
  const getColumnValuesRange = (sheet: Sheet, header) => {
    const columnIndex = ensuredColumnIndex(header);
    return sheet.getRange(2, columnIndex + 1, sheet.getMaxRows() - 1, 1);
  };

  const setSelectableOptionsForColumnValues = (
    sheet: Sheet,
    header,
    values
  ) => {
    const columnValuesRange = getColumnValuesRange(sheet, header);
    const currentDataValidation = columnValuesRange.getDataValidation();
    if (
      currentDataValidation.getCriteriaType() !==
        SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST ||
      !currentDataValidation.getCriteriaValues() ||
      JSON.stringify(currentDataValidation.getCriteriaValues()[0]) !==
        JSON.stringify(values)
    ) {
      columnValuesRange.setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(values)
          .build()
      );
    }
  };

  // Update selectable options based on catalog data
  const dataDependenciesSheetDataReferencesRange = getColumnValuesRange(
    dataDependenciesSheet,
    "Dataset reference"
  );
  const dataCatalogSheetDataReferencesRange = getColumnValuesRange(
    dataCatalogSheet,
    "Dataset reference"
  );
  dataDependenciesSheetDataReferencesRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(dataCatalogSheetDataReferencesRange)
      .build()
  );

  // Update selectable options based on hardcoded values
  setSelectableOptionsForColumnValues(dataDependenciesSheet, "Time unit", [
    "year",
    "decade"
  ]);
  setSelectableOptionsForColumnValues(
    dataDependenciesSheet,
    "Geo set",
    Object.keys(geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet)
  );
}
