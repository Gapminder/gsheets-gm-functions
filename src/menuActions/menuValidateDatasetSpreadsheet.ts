/**
 * @hidden
 */
import Range = GoogleAppsScript.Spreadsheet.Range;
/**
 * @hidden
 */
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
/**
 * @hidden
 */
import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
/**
 * @hidden
 */
import NamedRange = GoogleAppsScript.Spreadsheet.NamedRange;
import {
  validateConceptVersionArgument,
  versionNumber
} from "../lib/validateConceptVersionArgument";

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
interface OutputSheetMetadata {
  headerFormulas: string[];
  headers: string[];
  name: string;
  sheet: Sheet;
}

/**
 * Menu item action for "Gapminder Data -> Validate this dataset spreadsheet"
 * (only shown if the spreadsheet contains an "ABOUT" sheet and a named range called "dataset_id")
 *
 * Validates if the current dataset spreadsheet conforms to the comments found in
 * [the template](https://docs.google.com/spreadsheets/d/1ObY2k1SDDEwMfeM5jhQW8hIMcEpo8Oo0qclLZ3L6ByA/edit)
 * and writes the validation results in the Validation table at the bottom of the About sheet.
 *
 * Details:
 * - Checks the row headers of the output sheets (the so called "data-for-world/region/countries-etc/income-levels-by-year")
 * - Checks the about sheet (to see if it follows the requirements in col A in the template)
 * - Checks that filter mode is not turned on in output sheets (since it breaks the CSV endpoint)
 */
export function menuValidateDatasetSpreadsheet() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const aboutSheet = activeSpreadsheet.getSheetByName("ABOUT");
  const outputSheetsMetadata = getOutputSheetsMetadata(activeSpreadsheet);
  validateDatasetSpreadsheet(
    activeSpreadsheet,
    aboutSheet,
    outputSheetsMetadata
  );
}

/**
 * @hidden
 */
function getOutputSheetsMetadata(
  activeSpreadsheet: Spreadsheet
): OutputSheetMetadata[] {
  return getCurrentOutputSheets(activeSpreadsheet).map((outputSheet: Sheet) => {
    const dataRange = outputSheet.getDataRange();
    const headersRange = outputSheet.getRange(
      dataRange.getRow(),
      dataRange.getColumn(),
      1,
      dataRange.getNumColumns()
    );
    return {
      headerFormulas: headersRange.getFormulas()[0],
      headers: headersRange.getValues()[0].map(v => String(v)),
      name: outputSheet.getSheetName(),
      sheet: outputSheet
    };
  });
}

/**
 * @hidden
 */
function getCurrentOutputSheets(activeSpreadsheet: Spreadsheet): Sheet[] {
  return activeSpreadsheet
    .getSheets()
    .filter(
      (sheet: Sheet) =>
        sheet.getSheetName().indexOf("data-for-") === 0 &&
        sheet.getSheetName().indexOf("-in-columns") === -1 &&
        sheet.getSheetName().indexOf("-column") === -1
    );
}

/**
 * @hidden
 */
function validateDatasetSpreadsheet(
  activeSpreadsheet: Spreadsheet,
  aboutSheet: Sheet,
  outputSheetsMetadata: OutputSheetMetadata[]
) {
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

  // Output sheets validation

  // At least one output sheet
  if (outputSheetsMetadata.length === null) {
    recordValidationResult(
      "output-sheets",
      false,
      `There should be at least one output sheet (sheets starting with 'data-for-' and not ending with '-in-columns')`
    );
  } else {
    recordValidationResult(
      "output-sheets",
      true,
      `There is at least one output sheet present (sheets starting with 'data-for-' and not ending with '-in-columns')`
    );

    // At least one four header columns in each output sheet
    outputSheetsMetadata.map((outputSheetMetadata: OutputSheetMetadata) => {
      const key = `output-sheet:${outputSheetMetadata.name}`;
      if (outputSheetMetadata.headers.length < 4) {
        recordValidationResult(
          key,
          false,
          `The '${outputSheetMetadata.name}' output sheet should have at least 4 header columns`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `The '${outputSheetMetadata.name}' output sheet has at least 4 header columns`
        );
      }

      // No filter mode turned on in output sheets (since it breaks the CSV endpoint)
      if (outputSheetMetadata.sheet.getFilter() !== null) {
        recordValidationResult(
          key,
          false,
          `The '${outputSheetMetadata.name}' output sheet should not have filter mode turned on (since it breaks the CSV endpoint)`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `The '${outputSheetMetadata.name}' output sheet does not have filter mode turned on (since it breaks the CSV endpoint)`
        );
      }
    });
  }

  // About sheet validation + Validation of output sheets columns D forward

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

  const assertNamedRangeCoversTheEntireTable = (
    range: Range,
    name: string,
    tableName: string
  ) => {
    const rowValuesAreEmpty = rowValues =>
      rowValues.filter(rowValue => rowValue !== "").length === 0;
    // Two rows above the range should be empty (One row above is the header row)
    const twoRowsAboveRange = aboutSheet.getRange(
      range.getRow() - 2,
      range.getColumn(),
      1,
      range.getNumColumns()
    );
    const twoRowsAboveIsEmpty = rowValuesAreEmpty(
      twoRowsAboveRange.getValues()[0]
    );
    // One row below the range should be empty
    const oneRowBelowRange = aboutSheet.getRange(
      range.getRow() + range.getNumRows(),
      range.getColumn(),
      1,
      range.getNumColumns()
    );
    const oneRowBelowIsEmpty = rowValuesAreEmpty(
      oneRowBelowRange.getValues()[0]
    );
    if (!twoRowsAboveIsEmpty || !oneRowBelowIsEmpty) {
      recordValidationResult(
        name,
        false,
        `The named range '${name}' should cover the whole ${tableName} table (the rows immediately above and below the table should be empty)`
      );
    } else {
      recordValidationResult(
        name,
        true,
        `The named range '${name}' covers the whole ${tableName} table (the rows immediately above and below the table are empty)`
      );
    }
  };

  // This should start with a v, followed by an integer to show version of this dataset should probably be v1, for now, as you are creating it from the template. But in some cases, the first usage of this template may still deserve a higher version than 1, like when  building on Gapminder's previous series of versions, you should increment the version number used before adopting this template. The same version identifier is used in the version table further down in this sheet.
  const assertValidVersion = (version, key, reference) => {
    try {
      validateConceptVersionArgument(version);
      recordValidationResult(
        key,
        true,
        `The version ${reference} starts with a v, followed by an integer`
      );
      return true;
    } catch (e) {
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
    // It must start on the first row of indicators and end on the last row. This table is used to fetch all properties of the indicators.
    // You should adjust the numbers of rows to fit the number of indicators of the dataset. In future versions of your dataset, you can remove or add rows, if the number of indicators change.
    assertNamedRangeCoversTheEntireTable(
      indicatorTableRange,
      "indicator_table",
      "Indicator(s)"
    );

    // The order of columns in this nested table should not be changed.
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
      let columnIndex;

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
      // It is used as column headers in the "data-for-..." sheets.
      columnIndex = 1;
      if (indicatorTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no short indicator name (Column ${columnIndex +
            1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a short indicator name (Column ${columnIndex +
            1})`
        );
      }

      // Then go over the "data-for-.." sheets to make sure the column headers (column D and forward, with indicator names) use references to the cells with "Indicator(s)" here, so they match perfectly when the data is fetched.
      const headerIndex = i + 3;
      const indicatorNameCell = indicatorTableRange.getCell(rowNumber, 2);
      const expectedFormula = `=${aboutSheet.getSheetName()}!${indicatorNameCell.getA1Notation()}`;
      outputSheetsMetadata.map((outputSheetMetadata: OutputSheetMetadata) => {
        const outputSheetSpecificKey = `${key}:${outputSheetMetadata.name}`;
        const currentHeaderFormula =
          outputSheetMetadata.headerFormulas[headerIndex];
        const currentHeaderValue = outputSheetMetadata.headers[headerIndex];
        if (expectedFormula === currentHeaderFormula) {
          recordValidationResult(
            outputSheetSpecificKey,
            true,
            `The indicator name cell of indicator ${rowNumber} is referenced in the '${
              outputSheetMetadata.name
            }' output sheet in column ${headerIndex +
              1} as "${expectedFormula}"`
          );
        } else {
          recordValidationResult(
            outputSheetSpecificKey,
            false,
            `The indicator name cell of indicator ${rowNumber} should be referenced in the '${
              outputSheetMetadata.name
            }' output sheet in column ${headerIndex +
              1} as "${expectedFormula}" but is currently "${currentHeaderFormula ||
              currentHeaderValue}"`
          );
        }
      });

      // Description
      // This description will be used in visualisations when a user want's to understand what the indicator is measuring.
      columnIndex = 2;
      if (indicatorTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no description (Column ${columnIndex +
            1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a description (Column ${columnIndex + 1})`
        );
      }

      // Full name
      // This is a long, more technically exact version of the indicator name. E.g. "Total fertility rate"
      columnIndex = 3;
      if (indicatorTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no full name (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a full name (Column ${columnIndex + 1})`
        );
      }

      // Unit
      // The unit of the indicator.
      // For example: %, Babies, Deaths, US $,
      columnIndex = 4;
      if (indicatorTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no unit (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a unit (Column ${columnIndex + 1})`
        );
        if (
          String(indicatorTableRow[columnIndex]).match(/^ /) ||
          String(indicatorTableRow[columnIndex]).match(/ $/)
        ) {
          recordValidationResult(
            key,
            false,
            `Indicator ${rowNumber}'s unit should not start or end with a space`
          );
        } else {
          recordValidationResult(
            key,
            true,
            `Indicator ${rowNumber}'s unit does not start or end with a space`
          );
        }
      }

      // ID
      // This is a short id for storing the indicator in the database.
      // And it is also used in the link (url) to charts showing this data.
      columnIndex = 5;
      const indicatorId = String(indicatorTableRow[columnIndex]);
      if (indicatorId === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no ID (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has an ID (Column ${columnIndex + 1})`
        );

        // It MUST be a combination of lowercase (english) alphanumeric characters and underscore (regex: [a-z0-9_]+)
        if (indicatorId.match(/^([a-z0-9_]+)$/)) {
          recordValidationResult(
            key,
            true,
            `Indicator ${rowNumber}'s ID contains only lowercase latin characters (a-z) or numbers, and no space, dashes or underscores. (Column ${columnIndex +
              1})`
          );
        } else {
          recordValidationResult(
            key,
            false,
            `Indicator ${rowNumber}'s ID should contain only lowercase latin characters (a-z) or numbers, and no space, dashes or underscores. (Column ${columnIndex +
              1})`
          );
        }

        // It should be somewhat human readable, like an acronym,
        // (No validation performed at the moment)

        // Max 20 characters
        const maxCharacters = 20;
        if (indicatorId.length <= maxCharacters) {
          recordValidationResult(
            key,
            true,
            `Indicator ${rowNumber}'s ID has less than or equal to ${maxCharacters} characters`
          );
        } else {
          recordValidationResult(
            key,
            false,
            `Indicator ${rowNumber}'s ID should be max ${maxCharacters} characters. (The first ${maxCharacters} characters are '${indicatorId.substr(
              0,
              maxCharacters
            )}')`
          );
        }
      }

      // type
      // This should say "measure" i the indicator is a numeric measure. In some cases it's "category", for example in the Income Level data , where countries changes which level it is in over time. Another example of categories are found in the data about slavery legislation, where the legality status of slavery changes over time.
      columnIndex = 6;
      if (indicatorTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no type set (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a type set (Column ${columnIndex + 1})`
        );
      }

      // Usage
      // How useful is this indicator to a regular user. This value is used to rank search results, to make sure simpler things (simple = 1) come at the top.
      // 1 = understandable to anyone.
      // 2 = require extra knowledge
      // 3 = analytically advanced
      // 4 = technical measures, like uncertainties
      // 5 = understandable only to software developers
      columnIndex = 7;
      if (indicatorTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Indicator ${rowNumber} has no usage level set (Column ${columnIndex +
            1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Indicator ${rowNumber} has a usage level set (Column ${columnIndex +
            1})`
        );
      }
    });
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
      const maxCharacters = 45;
      if (sourceShortText.length <= maxCharacters) {
        recordValidationResult(
          key,
          true,
          `'${label}' has less than or equal to ${maxCharacters} characters`
        );
      } else {
        recordValidationResult(
          key,
          false,
          `'${label}' should be max ${maxCharacters} characters. (The first ${maxCharacters} characters are '${sourceShortText.substr(
            0,
            maxCharacters
          )}')`
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
    // It must start on the first row and end on the last row.
    // You should adjust the numbers of rows to fit the number of sources of the dataset. In future versions of your dataset, you can remove or add rows, if the number of sources change.
    assertNamedRangeCoversTheEntireTable(
      sourcesTableRange,
      "source_table",
      "Sources"
    );

    // The order of columns in this nested table, should not be changed.
    // (No validation performed at the moment)

    const sourcesTableValues = sourcesTableRange.getValues();
    if (sourcesTableValues.length === 0) {
      recordValidationResult(`source_table`, false, "Sources table is empty");
    }
    sourcesTableValues.map((sourcesTableRow, i) => {
      const rowNumber = i + 1;
      const key = `source_table:row_${rowNumber}`;
      let columnIndex;

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
      columnIndex = 1;
      if (sourcesTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Source ${rowNumber} has no source id (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Source ${rowNumber} has a source id (Column ${columnIndex + 1})`
        );
      }

      // Name
      columnIndex = 2;
      if (sourcesTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Source ${rowNumber} has no name (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Source ${rowNumber} has a name (Column ${columnIndex + 1})`
        );
      }

      // Link
      columnIndex = 3;
      if (sourcesTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Source ${rowNumber} has no link (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Source ${rowNumber} has a link (Column ${columnIndex + 1})`
        );
      }
    });
  }

  // Versions table
  const versionsTableRange = assertExistingNamedRange("version_table");
  if (versionsTableRange) {
    // Make sure the named range "version_table" covers the complete table area here.
    // It must start on the first row and end on the last row.
    // You should adjust the numbers of rows to fit the number of versions of the dataset. When you create a new version of the dataset, you will copy the work document, and the link to the copy, will be what you paste in this version table, inside the work document, from which it is fetched in the data process.
    assertNamedRangeCoversTheEntireTable(
      versionsTableRange,
      "version_table",
      "Versions"
    );

    // The order of columns in this nested table, should not be changed.
    // (No validation performed at the moment)

    const versionsTableValues = versionsTableRange.getValues();
    if (versionsTableValues.length === 0) {
      recordValidationResult(`version_table`, false, "Versions table is empty");
    }
    let firstListedVersionNumber: number;
    versionsTableValues.map((versionsTableRow, i) => {
      const rowNumber = i + 1;
      const key = `version_table:row_${rowNumber}`;
      let columnIndex;

      // Each row will keep a link to the versioned doc (which is a copy of the work doc, at the time the versions was published). This enables us to fall back to previous versions. The date and contributors should be fetched from the doc. But the changes you edit manually.

      // Version
      columnIndex = 0;
      if (versionsTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Version-listing ${rowNumber} has no version reference set (Column ${columnIndex +
            1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Version-listing ${rowNumber} has a version reference set (Column ${columnIndex +
            1})`
        );
        assertValidVersion(
          versionsTableRow[columnIndex],
          key,
          `in column ${columnIndex + 1}`
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
      columnIndex = 1;
      if (versionsTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Version-listing ${rowNumber} has no link (Column ${columnIndex + 1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Version-listing ${rowNumber} has a link (Column ${columnIndex + 1})`
        );
      }

      // Changes compared to previous
      columnIndex = 2;
      if (versionsTableRow[columnIndex] === "") {
        recordValidationResult(
          key,
          false,
          `Version-listing ${rowNumber} has no "Changes compared to previous" (Column ${columnIndex +
            1})`
        );
      } else {
        recordValidationResult(
          key,
          true,
          `Version-listing ${rowNumber} has "Changes compared to previous" (Column ${columnIndex +
            1})`
        );
      }

      // Date
      // (No validation performed at the moment)

      // Contributors
      // (No validation performed at the moment)
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
  // This table uses GM_DATAPOINT_CATALOG_STATUS to determine how available the dataset is to GM_* functions in general.
  // Remove and add rows as necessary to cover all variations of time unit and geo_set that the dataset covers
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
    // Remove excess rows in case the new validation results are smaller than previous validation results
    // This prevents stale data from lingering around after the validation
    aboutSheet.deleteRows(
      validationTableRange.getRow(),
      validationTableRange.getNumRows() - validationTableRangeValues.length
    );
  }
  if (validationTableRange.getNumRows() < validationTableRangeValues.length) {
    // Insert new rows if the existing range is smaller than the new validation results
    aboutSheet.insertRowsAfter(
      validationTableRange.getRow() + validationTableRange.getNumRows(),
      validationTableRangeValues.length - validationTableRange.getNumRows()
    );
  }
  const newValidationTableRange = aboutSheet.getRange(
    validationTableRange.getRow(),
    validationTableRange.getColumn(),
    validationTableRangeValues.length,
    3
  );

  // Work around a gsheets peculiarity where sheet-scoped named ranges may exist and
  // in such case take priority over spreadsheet-scoped named ranges, resulting in our new
  // named range never being used
  const sheets = activeSpreadsheet.getSheets();
  sheets.map((sheet: Sheet) => {
    const sheetNamedRanges = sheet.getNamedRanges();
    sheetNamedRanges.map((sheetNamedRange: NamedRange) => {
      if (sheetNamedRange.getName() === "validation_table") {
        sheetNamedRange.remove();
      }
    });
  });
  if (activeSpreadsheet.getRangeByName("validation_table")) {
    activeSpreadsheet.removeNamedRange("validation_table");
  }

  // Set new named range to reflect the new size of the validation table
  activeSpreadsheet.setNamedRange("validation_table", newValidationTableRange);

  // Replace old values with the new
  validationTableRange.clearContent();
  newValidationTableRange.setValues(validationTableRangeValues);

  return;
}
