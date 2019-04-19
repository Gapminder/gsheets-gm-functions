import {
  FasttrackCatalogDataPointsDataRow,
  getFasttrackCatalogDataPointsList
} from "../gsheetsData/fastttrackCatalog";
import { geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet } from "../gsheetsData/hardcodedConstants";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

/**
 * @hidden
 */
export const expectedFirstHeaders = [
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
export const ensuredColumnIndex = (header: string) => {
  const index = expectedFirstHeaders.indexOf(header);
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
  const headersRange = sheet.getRange(1, 1, 1, expectedFirstHeaders.length);
  headersRange.setValues([expectedFirstHeaders]);
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
export function getDataDependenciesWithHeaderRow(sheet: Sheet) {
  const dataDependenciesWithHeaderRowRange = sheet.getRange(
    1,
    1,
    sheet.getDataRange().getNumRows(),
    expectedFirstHeaders.length
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
  const firstHeaders = headerRow[0].slice(0, expectedFirstHeaders.length);
  if (JSON.stringify(firstHeaders) !== JSON.stringify(expectedFirstHeaders)) {
    SpreadsheetApp.getUi().alert(
      `The first column headers in 'data-dependencies' must be ${JSON.stringify(
        expectedFirstHeaders
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
export function implementDataDependenciesSheetStylesFormulasAndValidations(
  sheet,
  fasttrackCatalogDataPointsWorksheetData
) {
  const getColumnValuesRange = ($sheet: Sheet, header) => {
    const columnIndex = ensuredColumnIndex(header);
    return $sheet.getRange(2, columnIndex + 1, $sheet.getMaxRows() - 1, 1);
  };

  const setSelectableOptionsForColumnValues = (
    $sheet: Sheet,
    header,
    values
  ) => {
    const columnValuesRange = getColumnValuesRange($sheet, header);
    const currentDataValidation = columnValuesRange.getDataValidation();
    if (
      currentDataValidation.getCriteriaType() !==
        SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST ||
      JSON.stringify(currentDataValidation.getCriteriaValues()) !==
        JSON.stringify(values)
    ) {
      console.log(
        "setSelectableOptionsForColumnValues",
        JSON.stringify(currentDataValidation.getCriteriaValues()),
        JSON.stringify(values)
      );
      columnValuesRange.setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(values)
          .build()
      );
    }
  };

  // Update selectable options based on catalog data
  const fasttrackCatalogConceptIds = fasttrackCatalogDataPointsWorksheetData.rows.map(
    (row: FasttrackCatalogDataPointsDataRow) => {
      return `${row.concept_id}@fasttrack`;
    }
  );
  setSelectableOptionsForColumnValues(
    sheet,
    "Dataset reference",
    fasttrackCatalogConceptIds
  );

  // Update selectable options based on hardcoded values
  setSelectableOptionsForColumnValues(sheet, "Time unit", ["year", "decade"]);
  setSelectableOptionsForColumnValues(
    sheet,
    "Geo set",
    Object.keys(geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet)
  );
}
