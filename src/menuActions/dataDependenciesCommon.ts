import {
  FasttrackCatalogDataPointsDataRow,
  FasttrackCatalogDataPointsWorksheetData,
  getFasttrackCatalogDataPointsList
} from "../gsheetsData/fastttrackCatalog";
import { geoSets } from "../gsheetsData/hardcodedConstants";
import {
  preProcessInputRangeWithHeaders,
  removeEmptyRowsAtTheEnd
} from "../lib/cleanInputRange";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {
  getOpenNumbersDatasetConceptListing,
  OpenNumbersDatasetConceptListingDataRow
} from "../openNumbersData/openNumbersDataset";

/**
 * @hidden
 */
const dataDependenciesHeaders = [
  "Concept ID and catalog reference",
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
  "Concept ID and catalog reference",
  "Concept Name",
  "Time unit",
  "Geo set",
  "Dataset ID",
  "CSV"
];

/**
 * @hidden
 */
const ensuredColumnIndex = (header: string) => {
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
  { lastChecked, notes, importRangeRows }
) {
  const importRangeDataRows =
    importRangeRows !== null ? importRangeRows - 1 : null;
  const dataRowsColumnIndex = ensuredColumnIndex("Data rows");
  const updatedRowValues = [importRangeDataRows, lastChecked, notes];
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
function createDataDependenciesSheet(spreadsheet) {
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
function createDataCatalogSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(
    "data-catalog",
    spreadsheet.getNumSheets()
  );
  const headersRange = sheet.getRange(1, 1, 1, dataCatalogHeaders.length);
  headersRange.setValues([dataCatalogHeaders]);
  headersRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert(
    "No sheet named 'data-catalog' was found. It has now been added and will soon be filled with the list of available indicators and concept data that can be used as data dependencies."
  );
  return sheet;
}

/**
 * @hidden
 */
function getDataDependenciesWithHeaderRow(sheet: Sheet) {
  const dataDependenciesWithHeaderRowRange = sheet.getRange(
    1,
    1,
    sheet.getDataRange().getNumRows(),
    dataDependenciesHeaders.length
  );
  return removeEmptyRowsAtTheEnd(
    dataDependenciesWithHeaderRowRange.getValues()
  );
}

/**
 * @hidden
 */
function assertCorrectDataDependenciesSheetHeaders(
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
function refreshDataCatalogSheet(
  sheet,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData,
  openNumbersWorldDevelopmentIndicatorsDatasetConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  const fasttrackCatalogValues = fasttrackCatalogDataPointsWorksheetData.rows.map(
    (row: FasttrackCatalogDataPointsDataRow) => {
      return [
        `${row.concept_id}@fasttrack`,
        row.concept_name,
        row.time_unit,
        row.geo_set,
        row.dataset_id,
        row.csv_link
      ];
    }
  );
  const openNumbersDatasetValues = openNumbersWorldDevelopmentIndicatorsDatasetConceptListing.map(
    (row: OpenNumbersDatasetConceptListingDataRow) => {
      return [
        `${row.concept_id}@open-numbers-wdi`,
        row.concept_name,
        row.time_unit,
        row.geo_set,
        row.dataset_id,
        row.csv_link
      ];
    }
  );
  const dataCatalogValues = [dataCatalogHeaders].concat(
    fasttrackCatalogValues,
    openNumbersDatasetValues
  );
  sheet
    .getRange(1, 1, dataCatalogValues.length, dataCatalogHeaders.length)
    .setValues(dataCatalogValues);
}

/**
 * @hidden
 */
function getColumnValuesRange(sheet: Sheet, header) {
  const columnIndex = ensuredColumnIndex(header);
  return sheet.getRange(2, columnIndex + 1, sheet.getMaxRows() - 1, 1);
}

/**
 * @hidden
 */
function implementDataDependenciesValidations(
  dataDependenciesSheet: Sheet,
  dataCatalogSheet: Sheet
) {
  const setSelectableOptionsForColumnValues = (
    sheet: Sheet,
    header,
    values
  ) => {
    const columnValuesRange = getColumnValuesRange(sheet, header);
    const currentDataValidation = columnValuesRange.getDataValidation();
    if (
      !currentDataValidation ||
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
    "Concept ID and catalog reference"
  );
  const dataCatalogSheetDataReferencesRange = getColumnValuesRange(
    dataCatalogSheet,
    "Concept ID and catalog reference"
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
    geoSets
  );
}

/**
 * @hidden
 */
export function adjustSheetRowsAndColumnsCount(
  sheet: Sheet,
  desiredRowCount,
  desiredColumnCount
) {
  if (sheet.getMaxRows() > desiredRowCount) {
    sheet.deleteRows(desiredRowCount + 1, sheet.getMaxRows() - desiredRowCount);
  }
  if (sheet.getMaxColumns() > desiredColumnCount) {
    sheet.deleteColumns(
      desiredColumnCount + 1,
      sheet.getMaxColumns() - desiredColumnCount
    );
  }
  if (sheet.getMaxRows() < desiredRowCount) {
    sheet.insertRowsAfter(
      sheet.getMaxRows(),
      desiredRowCount - sheet.getMaxRows()
    );
  }
  if (sheet.getMaxColumns() < desiredColumnCount) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      desiredColumnCount - sheet.getMaxColumns()
    );
  }
}

/**
 * @hidden
 */
export function refreshDataCatalog(activeSpreadsheet) {
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

  // Limit the amount of rows of the spreadsheet to the amount of data dependencies + a few extras for adding new ones
  const desiredRowCount = dataDependencies.length + 1 + 3;
  const desiredColumnCount = dataDependenciesHeaders.length;
  adjustSheetRowsAndColumnsCount(
    dataDependenciesSheet,
    desiredRowCount,
    desiredColumnCount
  );

  // Fill the "Catalog status" column with the GM_DATAPOINT_CATALOG_STATUS function
  const catalogStatusRange = getColumnValuesRange(
    dataDependenciesSheet,
    "Catalog status"
  );
  const sheetValueRowsCount = dataDependenciesSheet.getMaxRows() - 1;
  function arrayOfASingleValue(value, len): any[] {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  }
  const formulas = arrayOfASingleValue(
    '=IF(R[0]C[-3]<>"",GM_DATAPOINT_CATALOG_STATUS(R[0]C[-3],R[0]C[-2],R[0]C[-1], TRUE),"")',
    sheetValueRowsCount
  );
  const formulaRows = formulas.map(formula => [formula]);
  catalogStatusRange.setFormulasR1C1(formulaRows);

  return {
    dataDependenciesSheet,
    dataDependenciesWithHeaderRow,
    fasttrackCatalogDataPointsWorksheetData,
    openNumbersWorldDevelopmentIndicatorsDatasetConceptListing
  };
}
