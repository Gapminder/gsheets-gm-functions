/**
 * @hidden
 */
interface ValidationResult {
  key: string;
  passed: boolean;
  result: string;
}

/**
 * @hidden
 */
export function menuValidateDatasetSpreadsheet() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const aboutSheet = activeSpreadsheet.getSheetByName("ABOUT");

  // Should not be possible since we only show this menu item if the about sheet exists. Nevertheless:
  if (aboutSheet === null) {
    SpreadsheetApp.getUi().alert(
      "No sheet named 'ABOUT' was found. Please add it to your dataset spreadsheet and run this again."
    );
    return;
  }

  const validationResults: ValidationResult[] = [];

  // About this file
  // This text is the roughly the same in all Gapminder's datasets, to explain to a user what kind of file they have encountered.
  // (No validation performed at the moment)

  // Version:
  // This should start with a v, followed by an integer to show version of this dataset should probably be v1, for now, as you are creating it from the template. But in some cases, the first usage of this template may still deserve a higher version than 1, like when  building on Gapminder's previous series of versions, you should increment the version number used before adopting this template. The same version identifier is used in the version table further down in this sheet.
  // (No validation performed at the moment)

  const versionRange = activeSpreadsheet.getRangeByName("version");
  if (versionRange === null) {
    validationResults.push({
      key: "version",
      passed: false,
      result: "BAD: Named range 'version' is missing"
    });
  } else {
    validationResults.push({
      key: "version",
      passed: false,
      result: "GOOD: Named range 'version' exists"
    });
  }
  const version = versionRange.getValue();
  if (version === "") {
    validationResults.push({
      key: "version",
      passed: false,
      result: "BAD: Version is empty"
    });
  } else {
    validationResults.push({
      key: "version",
      passed: true,
      result: "GOOD: Version is filled in"
    });
  }

  // Update validation results
  const validationTableRange = activeSpreadsheet.getRangeByName(
    "validation_table"
  );

  // Either all good or validation results to display
  const allGoodValidationRow = [
    1,
    "passed-validation",
    "GOOD: All validation checks passed"
  ];
  let validationTableRangeValues;
  if (
    validationResults.filter(
      (validationResult: ValidationResult) => validationResult.passed !== true
    ).length === 0
  ) {
    validationTableRangeValues = [allGoodValidationRow];
  } else {
    validationTableRangeValues = validationResults.map(
      (validationResult: ValidationResult, i) => {
        return [i, validationResult.key, validationResult.result];
      }
    );
  }

  // Accommodate the validation table range to hold the validation results
  if (validationTableRange.getNumRows() > validationTableRangeValues.length) {
    // Remove excess rows and columns in case the new validation results are smaller than previous validation results
    // This prevents stale data from lingering around after the validation
    aboutSheet.deleteRows(
      validationTableRange.getRow() + validationTableRange.getNumRows(),
      validationTableRange.getNumRows() - validationTableRangeValues.length
    );
  }
  if (validationTableRange.getNumRows() < validationTableRangeValues.length) {
    // Insert new rows if the existing range is smaller than the new validation results
    aboutSheet.insertRows(
      validationTableRange.getNumRows(),
      validationTableRangeValues.length - validationTableRange.getNumRows()
    );
  }
  const newValidationTableRange = aboutSheet.getRange(
    validationTableRange.getRow(),
    validationTableRange.getColumn(),
    validationTableRangeValues.length,
    allGoodValidationRow.length
  );
  activeSpreadsheet.setNamedRange("validation_table", newValidationTableRange);

  // Replace old values with the new
  validationTableRange.clearContent();
  newValidationTableRange.setValues(validationTableRangeValues);

  return;
}
