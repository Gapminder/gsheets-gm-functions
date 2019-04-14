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

  const recordValidationResult = (key, passed, message) => {
    validationResults.push({
      key,
      passed,
      result: `${passed ? "GOOD" : "BAD"}: ${message}`
    });
  };

  const assertExistingNamedRange = name => {
    const namedRange = activeSpreadsheet.getRangeByName(name);
    if (namedRange === null) {
      recordValidationResult(name, false, `Named range '${name}' is missing`);
      return false;
    } else {
      recordValidationResult(name, true, `Named range '${name}' exists`);
      return namedRange;
    }
  };

  const assertNonEmptySingleValueRange = (singleValueRange, key, label) => {
    const value = singleValueRange.getValue();
    if (value === "") {
      recordValidationResult(key, false, `'${label}' is empty`);
      return false;
    } else {
      recordValidationResult(key, true, `'${label}' is filled in`);
      return value;
    }
  };

  // About this file
  // This text is the roughly the same in all Gapminder's datasets, to explain to a user what kind of file they have encountered.
  // (No validation performed at the moment)

  // Version:
  const versionRange = assertExistingNamedRange("version");
  if (versionRange) {
    const version = assertNonEmptySingleValueRange(
      versionRange,
      "version",
      "Version:"
    );
    if (version !== false) {
      // This should start with a v, followed by an integer to show version of this dataset should probably be v1, for now, as you are creating it from the template. But in some cases, the first usage of this template may still deserve a higher version than 1, like when  building on Gapminder's previous series of versions, you should increment the version number used before adopting this template. The same version identifier is used in the version table further down in this sheet.
      // (No validation performed at the moment)
    }
  }

  // Updated:
  // The date when this version was published.
  const lastUpdatedRange = assertExistingNamedRange("date");
  if (lastUpdatedRange) {
    assertNonEmptySingleValueRange(lastUpdatedRange, "date", "Updated:");
  }

  // Download latest version:
  // A link to download the dataset as excel file. This link is automatically generated using the doc id in the technical section at the bottom of this sheet.
  // (No validation performed at the moment)

  // Latest version online:
  // A link to the latest version of this dataset. Automatically generated from the doc id in the technical section below.
  // (No validation performed at the moment)
  const gapmioRange = assertExistingNamedRange("gapmio");
  if (gapmioRange) {
    assertNonEmptySingleValueRange(
      gapmioRange,
      "gapmio",
      "Latest version online:"
    );
  }

  // Contributor(s) to this version:
  // This is the list of people who have contributed to this dataset. in the name of one or more dataset authors. If you only made minor improvements, keep the names of
  // (No validation performed at the moment)
  // activeSpreadsheet.getRangeByName("contributors");

  // Feedback
  // A link to the Gapminder forum where people should ask questions about this data.
  // (No validation performed at the moment)

  // Indicator(s) table
  // This is the indicator table for the data in this doc.
  const indicatorTableRange = assertExistingNamedRange("indicator_table");
  if (indicatorTableRange) {
    // Make sure the named range "indicator_table" covers the complete table.
    // It must start on the first row of indicators and ending on the last row. This table is used to fetch all properties of the indicators.
    // (No validation performed at the moment)

    // The order of columns in this nested table should not be changed. You should adjust the numbers of rows to fit the number of indicators of the dataset. In future versions of your dataset, you can remove or add rows, if the number of indicators change.
    // (No validation performed at the moment)

    const indicatorTableValues = indicatorTableRange.getValues();
    console.log(
      "menuValidateDatasetSpreadsheet - indicatorTableValues",
      indicatorTableValues
    );
    if (indicatorTableValues.length === 0) {
      recordValidationResult(
        `indicator_table`,
        false,
        "Indicator table is empty"
      );
    }
    indicatorTableValues.map((indicatorTableRow, i) => {
      const rowNumber = i + 1;
      const key = `indicator_table:row_${rowNumber}`;

      // #
      // Make sure the first column has a incremental number for each indicator you define.
      // This first column assigns a number (from 1 and up) to each indicator in this doc, which is used by the data process to identify each indicator in the name-space of this doc. In other datasets, other indicators may have the same order number. It's NOT a universal number across all Gapminder's datasets.
      if (Number(indicatorTableRow[0]) !== rowNumber) {
        recordValidationResult(
          key,
          false,
          `This first column of row '${rowNumber}' in the indicator(s) table should be incremental (from 1 and up)`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `This first column of row '${rowNumber}' in the indicator(s) table is incremental (from 1 and up)`
        );
      }

      // Indicator(s)
      // This is the short, simple to understand, version of the indicator name. E.g. "Babies per woman"
      // It is used as column headers in the "data-..." sheets.
      // (No validation performed at the moment)

      // Description
      // This description will be used in visualisations when a user want's to understand what the indicator is measuring.
      // (No validation performed at the moment)

      // Full name
      // This is a long, more technically exact version of the indicator name. E.g. "Total fertility rate"
      // (No validation performed at the moment)

      // Unit
      // The unit of the indicator.
      // For example: %, Babies, Deaths, US $,
      // (No validation performed at the moment)

      // ID
      // This is a short id for storing the indicator in the database.
      // It should be short, and contain only lowercase latin characters or numbers. But no space, dashes or underscores. It should be  somewhat human readable, like an acronym, but less than 20 characters.
      // Ad its also used in the link (url) to charts showing this data.
      // (No validation performed at the moment)

      // type
      // This should say "measure" i the indicator is a numeric measure. In some cases it's "category", for example in the Income Level data , where countries changes which level it is in over time. Another example of categories are found in the data about slavery legislation, where the legality status of slavery changes over time.
      // (No validation performed at the moment)

      // Usage
      // How useful is this indicator to a regular user. This value is used to rank search results, to make sure simpler things (simple = 1) come at the top.
      // 1 = understandable to anyone.
      // 2 = require extra knowledge
      // 3 = analytically advanced
      // 4 = technical measures, like uncertainties
      // 5 = understandable only to software developers
      // (No validation performed at the moment)

      /*
      if (indicatorTableRow.length === 0) {
        recordValidationResult(key, false, "Indicator table is");
      } else {
        recordValidationResult(key, true, "'Updated:' is filled in");
      }
      */
    });

    // Then go over the "data-.." sheets to make sure the column headers (column D and forward, with indicator names) use references to the cells with "Indicator(s)" here, so they match perfectly when the data is fetched.
    // (No validation performed at the moment)
  }

  // Sources section
  // Describe the process of data creation without pretending that all of this is Gapminder's data. Instead describe how Gapminder uses data, and Gapminder shares the data we use.
  // (No validation performed at the moment)

  // Dataset description:
  // Describe where this data originates from, how raw data was collected by the original datasource and outline roughly what Gapminder did with the data.
  // (No validation performed at the moment)

  // Link to documentation:
  // This is automatically generated
  const sourceUrlRange = assertExistingNamedRange("source_url");
  if (sourceUrlRange) {
    assertNonEmptySingleValueRange(
      sourceUrlRange,
      "source_url",
      "Link to documentation:"
    );
  }

  // Short source summary:
  const sourceShortTextRange = assertExistingNamedRange("source_short_text");
  if (sourceShortTextRange) {
    const sourceShortText = assertNonEmptySingleValueRange(
      sourceShortTextRange,
      "source_short_text",
      "Short source summary:"
    );
    if (sourceShortText !== false) {
      // Summary of sources must be less than 45 characters. It shows under graphs using this data, as a snippet summarising the sources. For example:
      // "Gapminder based on UNESCO"
      // (No validation performed at the moment)
    }
  }

  // Sources table
  // — Make sure the named range "source_table" covers the complete table area here.
  // It must starting on the first row and ending on the last row.
  // The order of columns in this nested table, should not be changed. You should adjust the numbers of rows to fit the number of indicators of the dataset. In future versions of your dataset, you can remove or add rows, if the number of  indicators change.
  // (No validation performed at the moment)
  // activeSpreadsheet.getRangeByName("source_table");

  // Below comes the "source table", which is like a nested table within this larger spreadsheet.
  // The rows should list a major source used as input in the data process behind this data.
  // (No validation performed at the moment)

  // Add the second source here. Make sure the first column has a number that is incrementing for each source you add.
  // If you used more than one sources, add more rows to this list. By selecting the row, and right clicking the row, you can insert "Add above" and automatically extend the named range of the source table. If you use other Gapminder data as input, paste the gapm.io/d of those datasets as link.
  // (No validation performed at the moment)

  // Versions table
  // — Make sure the named range  "version_table" covers the complete table area here.
  // It must start on the first row and ending on the last row.
  // The order of columns in this nested table, should not be changed. You should adjust the numbers of rows to fit the number of indicators of the dataset. When you create a new version of the dataset, you will copy the work document, and the link to the copy, will be what you paste in this version table, inside the work document, form which it is fetched in the dataprocess.
  // (No validation performed at the moment)
  // activeSpreadsheet.getRangeByName("version_table");

  // Each row will keep a link to the versioned doc (which is a copy of the work doc, at the time the versions was published). This enables us to fall back to previous versions. The date and contributors should be fetched from the doc. But the changes you edit manually.
  // (No validation performed at the moment)

  // Add the second version here. Make sure the first column has a number that is incrementing for each version you add.
  // If you used more than one versions, add more rows to this list. By selecting the row, and right clicking the row, you can insert "Add above" and automatically extend the named range of the version table.
  // (No validation performed at the moment)

  // Technical stuff section

  // Dataset name:
  // The name of the dataset as it shows up in the data catalog used by Gapminder to keep track of datasets.
  const datasetNameRange = assertExistingNamedRange("dataset_name");
  if (datasetNameRange) {
    assertNonEmptySingleValueRange(
      datasetNameRange,
      "dataset_name",
      "Dataset name:"
    );
  }

  // Dataset id:
  // The id of the dataset in the dataset catalog, used by Gapminder to keep track of datasets.
  const datasetIdRange = assertExistingNamedRange("dataset_id");
  if (datasetIdRange) {
    assertNonEmptySingleValueRange(datasetIdRange, "dataset_id", "Dataset id:");
  }

  // Doc url
  // Copy the address to this doc / the work doc) into this cell. On the next row, the Google id should be extracted automatically.
  // Each dataset has a work doc, from which all the version are copied.
  const docUrlRange = assertExistingNamedRange("doc_url");
  if (docUrlRange) {
    // Auto-fix
    docUrlRange.setValue(activeSpreadsheet.getUrl());
    assertNonEmptySingleValueRange(docUrlRange, "doc_url", "Doc url");
  }

  // DDF mapping:
  // The named range below is a table with column order in the indicator table. This should not change unless we decide to change the order of the indicator table.
  // (No validation performed at the moment)
  // activeSpreadsheet.getRangeByName("concept_id_column");
  // activeSpreadsheet.getRangeByName("name_short_column");
  // activeSpreadsheet.getRangeByName("name_column");
  // activeSpreadsheet.getRangeByName("description_column");
  // activeSpreadsheet.getRangeByName("unit_column");
  // activeSpreadsheet.getRangeByName("type_column");
  // activeSpreadsheet.getRangeByName("usage_column");

  // Catalog status table
  // This table uses GM_DATASET_CATALOG_STATUS to determine how available the dataset is to GM_* functions in general.
  // Remove and add rows as necessary to cover all variations of time unit and geography that the dataset covers
  // (No validation performed at the moment)

  // "If everything looks good, you can delete the yellow instruction column"
  // If no failing validation rules, fail validation if the yellow instruction column is still present
  // (No validation performed at the moment)

  // Currently broken named ranges in the template:
  // activeSpreadsheet.getRangeByName("contributor_profiles");
  // activeSpreadsheet.getRangeByName("contributors_ids");

  // Update validation results
  const validationTableRange = activeSpreadsheet.getRangeByName(
    "validation_table"
  );
  const validationTableRangeValues = validationResults.map(
    (validationResult: ValidationResult, i) => {
      return [i + 1, validationResult.key, validationResult.result];
    }
  );

  // Accommodate the validation table range to hold the validation results
  if (validationTableRange.getNumRows() > validationTableRangeValues.length) {
    // Remove excess rows and columns in case the new validation results are smaller than previous validation results
    // This prevents stale data from lingering around after the validation
    aboutSheet.deleteRows(
      validationTableRange.getRow(),
      validationTableRange.getNumRows() - validationTableRangeValues.length
    );
  }
  if (validationTableRange.getNumRows() < validationTableRangeValues.length) {
    // Insert new rows if the existing range is smaller than the new validation results
    aboutSheet.insertRows(
      validationTableRange.getRow(),
      validationTableRangeValues.length - validationTableRange.getNumRows()
    );
  }
  const newValidationTableRange = aboutSheet.getRange(
    validationTableRange.getRow(),
    validationTableRange.getColumn(),
    validationTableRangeValues.length,
    3
  );
  activeSpreadsheet.setNamedRange("validation_table", newValidationTableRange);

  // Replace old values with the new
  validationTableRange.clearContent();
  newValidationTableRange.setValues(validationTableRangeValues);

  return;
}
