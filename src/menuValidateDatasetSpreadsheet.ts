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

  // In case an older version of the template was used to create the about sheet
  const validationTableRange = activeSpreadsheet.getRangeByName(
    "validation_table"
  );
  if (validationTableRange === null) {
    SpreadsheetApp.getUi().alert(
      "No named range 'validation_table' was found. It is mandatory since it is used to report the results of the validation. Please add it to your ABOUT sheet and run this again."
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

  const versionNumber = version => {
    return Number(String(version).replace(/^v/, ""));
  };

  // This should start with a v, followed by an integer to show version of this dataset should probably be v1, for now, as you are creating it from the template. But in some cases, the first usage of this template may still deserve a higher version than 1, like when  building on Gapminder's previous series of versions, you should increment the version number used before adopting this template. The same version identifier is used in the version table further down in this sheet.
  const assertValidVersion = (version, key, reference) => {
    if (
      version === `v${versionNumber(version)}` &&
      versionNumber(version) > 0
    ) {
      recordValidationResult(
        key,
        true,
        `The version ${reference} starts with a v, followed by an integer`
      );
      return true;
    } else {
      recordValidationResult(
        key,
        false,
        `The version ${reference} should start with a v, followed by an integer`
      );
      return false;
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
      assertValidVersion(version, "version", "at 'Version:'");
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
  const gapmioRange = assertExistingNamedRange("gapmio");
  if (gapmioRange) {
    assertNonEmptySingleValueRange(
      gapmioRange,
      "gapmio",
      "Latest version online:"
    );
  }

  // Contributor(s) to this version:
  // This is the list of people who have contributed to this dataset. Fill in the name of one or more dataset authors. If you only made minor improvements, keep the names of
  const contributorsRange = assertExistingNamedRange("contributors");
  if (contributorsRange) {
    assertNonEmptySingleValueRange(
      contributorsRange,
      "contributors",
      "Contributor(s) to this version:"
    );
  }

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
      let columnNumber;

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
      columnNumber = 1;
      if (indicatorTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no short indicator name (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a short indicator name (Column ${columnNumber})`
        );
      }

      // Description
      // This description will be used in visualisations when a user want's to understand what the indicator is measuring.
      columnNumber = 2;
      if (indicatorTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no description (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a description (Column ${columnNumber})`
        );
      }

      // Full name
      // This is a long, more technically exact version of the indicator name. E.g. "Total fertility rate"
      columnNumber = 3;
      if (indicatorTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no full name (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a full name (Column ${columnNumber})`
        );
      }

      // Unit
      // The unit of the indicator.
      // For example: %, Babies, Deaths, US $,
      columnNumber = 4;
      if (indicatorTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no unit (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a unit (Column ${columnNumber})`
        );
      }

      // ID
      // This is a short id for storing the indicator in the database.
      // And it is also used in the link (url) to charts showing this data.
      columnNumber = 5;
      const indicatorId = String(indicatorTableRow[columnNumber]);
      if (indicatorId === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no ID (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has an ID (Column ${columnNumber})`
        );

        // It should contain only lowercase latin characters (a-z) or numbers, and no space, dashes or underscores.
        if (indicatorId.match(/^([a-z0-9]*)$/)) {
          recordValidationResult(
            key,
            false,
            `Indicator ${rowNumber}'s ID contains only lowercase latin characters (a-z) or numbers, and no space, dashes or underscores. (Column ${columnNumber})`
          );
        } else {
          recordValidationResult(
            key,
            false,
            `Indicator ${rowNumber}'s ID should contain only lowercase latin characters (a-z) or numbers, and no space, dashes or underscores. (Column ${columnNumber})`
          );
        }

        // It should be somewhat human readable, like an acronym,
        // (No validation performed at the moment)

        // Max 20 characters
        if (indicatorId.length <= 20) {
          recordValidationResult(
            key,
            true,
            `Indicator ${rowNumber}'s ID should be max 20 characters`
          );
        } else {
          recordValidationResult(
            key,
            false,
            `Indicator ${rowNumber}'s ID has less than or equal to 20 characters`
          );
        }
      }

      // type
      // This should say "measure" i the indicator is a numeric measure. In some cases it's "category", for example in the Income Level data , where countries changes which level it is in over time. Another example of categories are found in the data about slavery legislation, where the legality status of slavery changes over time.
      columnNumber = 6;
      if (indicatorTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no type set (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a type set (Column ${columnNumber})`
        );
      }

      // Usage
      // How useful is this indicator to a regular user. This value is used to rank search results, to make sure simpler things (simple = 1) come at the top.
      // 1 = understandable to anyone.
      // 2 = require extra knowledge
      // 3 = analytically advanced
      // 4 = technical measures, like uncertainties
      // 5 = understandable only to software developers
      columnNumber = 7;
      if (indicatorTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no usage level set (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a usage level set (Column ${columnNumber})`
        );
      }
    });

    // Then go over the "data-.." sheets to make sure the column headers (column D and forward, with indicator names) use references to the cells with "Indicator(s)" here, so they match perfectly when the data is fetched.
    // (No validation performed at the moment)
  }

  // Sources section
  // Describe the process of data creation without pretending that all of this is Gapminder's data. Instead describe how Gapminder uses data, and Gapminder shares the data we use.

  // Dataset description:
  // Describe where this data originates from, how raw data was collected by the original datasource and outline roughly what Gapminder did with the data.
  const datasetDescriptionRange = assertExistingNamedRange(
    "dataset_description"
  );
  if (datasetDescriptionRange) {
    assertNonEmptySingleValueRange(
      datasetDescriptionRange,
      "dataset_description",
      "Dataset description:"
    );
  }

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
    const key = "source_short_text";
    const label = "Short source summary:";
    const sourceShortText = assertNonEmptySingleValueRange(
      sourceShortTextRange,
      key,
      label
    );
    if (sourceShortText !== false) {
      // Summary of sources must be max 45 characters. It shows under graphs using this data, as a snippet summarising the sources. For example:
      // "Gapminder based on UNESCO"
      if (sourceShortText.length <= 45) {
        recordValidationResult(
          key,
          true,
          `'${label}' should be max 45 characters`
        );
      } else {
        recordValidationResult(
          key,
          false,
          `'${label}' has less than or equal to 45 characters`
        );
      }
    }
  }

  // Sources table
  // Below comes the "source table", which is like a nested table within this larger spreadsheet.
  // The rows should list a major source used as input in the data process behind this data.
  const sourcesTableRange = assertExistingNamedRange("source_table");
  if (sourcesTableRange) {
    // Make sure the named range "source_table" covers the complete table area here.
    // It must starting on the first row and ending on the last row.
    // The order of columns in this nested table, should not be changed. You should adjust the numbers of rows to fit the number of sources of the dataset. In future versions of your dataset, you can remove or add rows, if the number of sources change.
    // (No validation performed at the moment)

    const sourcesTableValues = sourcesTableRange.getValues();
    if (sourcesTableValues.length === 0) {
      recordValidationResult(`source_table`, false, "Sources table is empty");
    }
    sourcesTableValues.map((sourcesTableRow, i) => {
      const rowNumber = i + 1;
      const key = `source_table:row_${rowNumber}`;
      let columnNumber;

      // #
      // Make sure the first column has a incremental number for each source you define.
      if (Number(sourcesTableRow[0]) !== rowNumber) {
        recordValidationResult(
          key,
          false,
          `This first column of row '${rowNumber}' in the sources table should be incremental (from 1 and up)`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `This first column of row '${rowNumber}' in the sources table is incremental (from 1 and up)`
        );
      }

      // Source id
      columnNumber = 1;
      if (sourcesTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Source ${rowNumber} has no source id (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Source ${rowNumber} has a source id (Column ${columnNumber})`
        );
      }

      // Name
      columnNumber = 2;
      if (sourcesTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Source ${rowNumber} has no name (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Source ${rowNumber} has a name (Column ${columnNumber})`
        );
      }

      // Link
      columnNumber = 3;
      if (sourcesTableRow[columnNumber] === "") {
        recordValidationResult(
          key,
          false,
          `Source ${rowNumber} has no link (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Source ${rowNumber} has a link (Column ${columnNumber})`
        );
      }
    });
  }

  // Versions table
  const versionsTableRange = assertExistingNamedRange("version_table");
  if (versionsTableRange) {
    // Make sure the named range "version_table" covers the complete table area here.
    // It must starting on the first row and ending on the last row.
    // The order of columns in this nested table, should not be changed. You should adjust the numbers of rows to fit the number of versions of the dataset. When you create a new version of the dataset, you will copy the work document, and the link to the copy, will be what you paste in this version table, inside the work document, form which it is fetched in the dataprocess.
    // (No validation performed at the moment)

    const versionsTableValues = versionsTableRange.getValues();
    if (versionsTableValues.length === 0) {
      recordValidationResult(`version_table`, false, "Versions table is empty");
    }
    let firstListedVersionNumber: number;
    versionsTableValues.map((versionsTableRow, i) => {
      const rowNumber = i + 1;
      const key = `version_table:row_${rowNumber}`;
      let columnNumber;

      // Each row will keep a link to the versioned doc (which is a copy of the work doc, at the time the versions was published). This enables us to fall back to previous versions. The date and contributors should be fetched from the doc. But the changes you edit manually.

      // Version
      columnNumber = 1;
      if (versionsTableRow[0] === "") {
        recordValidationResult(
          key,
          false,
          `Version-listing ${rowNumber} has no version reference set (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Version-listing ${rowNumber} has a version reference set (Column ${columnNumber})`
        );
        assertValidVersion(
          versionsTableRow[0],
          key,
          `in column ${columnNumber}`
        );
      }

      // Make sure the first column has a number that is incrementing for each version you add
      if (rowNumber === 1) {
        firstListedVersionNumber = versionNumber(versionsTableRow[0]);
      } else {
        const thisRowsListedVersionNumber = versionNumber(versionsTableRow[0]);
        if (
          thisRowsListedVersionNumber !==
          firstListedVersionNumber + rowNumber - 1
        ) {
          recordValidationResult(
            key,
            false,
            `This first column of row '${rowNumber}' in the versions table should be incremental`
          );
        } else {
          recordValidationResult(
            key,
            true,
            `This first column of row '${rowNumber}' in the versions table is incremental`
          );
        }
      }

      // Link
      columnNumber = 2;
      if (versionsTableRow[columnNumber - 1] === "") {
        recordValidationResult(
          key,
          false,
          `Version-listing ${rowNumber} has no link (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Version-listing ${rowNumber} has a link (Column ${columnNumber})`
        );
      }

      // Changes compared to previous
      columnNumber = 3;
      if (versionsTableRow[columnNumber - 1] === "") {
        recordValidationResult(
          key,
          false,
          `Version-listing ${rowNumber} has no "Changes compared to previous" (Column ${columnNumber})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Version-listing ${rowNumber} has "Changes compared to previous" (Column ${columnNumber})`
        );
      }
    });
  }

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
  // Each dataset has a work doc, from which all the version are copied.
  const docUrlRange = assertExistingNamedRange("doc_url");
  if (docUrlRange) {
    // Auto-fix: Copy the address to this doc / the work doc) into this cell.
    docUrlRange.setValue(activeSpreadsheet.getUrl());
    assertNonEmptySingleValueRange(docUrlRange, "doc_url", "Doc url");
  }

  // DDF mapping:
  // The named range below is a table with column order in the indicator table. This should not change unless we decide to change the order of the indicator table.
  // (No validation performed at the moment except that the named ranges exists)
  assertExistingNamedRange("concept_id_column");
  assertExistingNamedRange("name_short_column");
  assertExistingNamedRange("name_column");
  assertExistingNamedRange("description_column");
  assertExistingNamedRange("unit_column");
  assertExistingNamedRange("type_column");
  assertExistingNamedRange("usage_column");

  // Catalog status table
  // This table uses GM_DATASET_CATALOG_STATUS to determine how available the dataset is to GM_* functions in general.
  // Remove and add rows as necessary to cover all variations of time unit and geography that the dataset covers
  // (No validation performed at the moment)

  // "If everything looks good, you can delete the yellow instruction column"
  const nonPassingValidationsCount = validationResults.filter(
    (validationResult: ValidationResult) => validationResult.passed !== true
  ).length;
  if (nonPassingValidationsCount === 0) {
    // If no failing validation rules, fail validation if the yellow instruction column is still present
    // (No validation performed at the moment)
  }

  // Currently broken named ranges in the template:
  // activeSpreadsheet.getRangeByName("contributor_profiles");
  // activeSpreadsheet.getRangeByName("contributors_ids");
  // (No validation performed at the moment)

  // Update validation results
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
