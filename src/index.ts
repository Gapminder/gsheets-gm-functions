/**
 * This file is built and pushed to Google Scripts using the source code and tools at https://github.com/Gapminder/gsheets-gm-functions
 * Note: Global functions must be exposed to the (global as any) object, or it will not be picked up by gas-webpack-plugin.
 */

import { GM_AGGR } from "./GM_AGGR";
import { GM_DATA } from "./GM_DATA";
import { GM_DATASET_CATALOG_STATUS } from "./GM_DATASET_CATALOG_STATUS";
import { GM_DATASET_VALIDATION } from "./GM_DATASET_VALIDATION";
import { GM_GEO_LOOKUP_TABLE } from "./GM_GEO_LOOKUP_TABLE";
import { GM_GROWTH } from "./GM_GROWTH";
import { GM_ID } from "./GM_ID";
import { GM_IMPORT } from "./GM_IMPORT";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";
import { GM_NAME } from "./GM_NAME";
import { GM_PER_CAP } from "./GM_PER_CAP";
import { GM_UNPIVOT } from "./GM_UNPIVOT";
import { menuRefreshDataDependencies } from "./menuRefreshDataDependencies";
import { menuValidateDatasetSpreadsheet } from "./menuValidateDatasetSpreadsheet";

/* tslint:disable:only-arrow-functions */

// Configure custom menus

(global as any).onOpen = function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Gapminder Data");
  menu.addItem(
    `Import/refresh data dependencies`,
    "menuRefreshDataDependencies"
  );
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const aboutSheet = activeSpreadsheet.getSheetByName("ABOUT");
  const namedRanges = activeSpreadsheet.getNamedRanges();
  const namedRangeNames = namedRanges.map(namedRange => namedRange.getName());
  if (aboutSheet && namedRangeNames.includes("dataset_id")) {
    menu.addItem(
      `Validate this dataset spreadsheet`,
      "menuValidateDatasetSpreadsheet"
    );
  }
  menu.addToUi();
};

(global as any).menuRefreshDataDependencies = menuRefreshDataDependencies;
(global as any).menuValidateDatasetSpreadsheet = menuValidateDatasetSpreadsheet;

// Expose custom functions
//
// Note: The jsdoc below is manually curated based on the master
// versions in GM_*.ts to enable autocompletion and docs within the spreadsheet
// Differences between ordinary jsdoc and gsheets jsdoc are accounted for:
// 1. The @return statement is ignored by gsheets jsdoc and is thus omitted below
// 2. The parameter type declarations are actually the example usage strings in gsheets
//    jsdoc rather than actual type declarations
// 3. Gsheets jsdoc requires @customfunction to be present

/**
 * Aggregates an input table by id and time, returning a table with the aggregated values of the input table.
 *
 * The range must be four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * @param {A1:D} table_range_with_headers
 * @param {"four_regions"} aggregation_prop Aggregation property
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as “countries_etc”
 * @customfunction
 */
(global as any).GM_AGGR = function(
  table_range_with_headers: string[][],
  aggregation_prop: string,
  geography: string
) {
  return GM_AGGR(table_range_with_headers, aggregation_prop, geography);
};

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column range.
 *
 * Note that using a range from a locally imported data dependency is the only performant way to join concept data in a spreadsheet.
 *
 * Takes 10-20 seconds:
 * =GM_DATA(B7:D, "pop")
 *
 * Takes 2-4 seconds:
 * =GM_DATA(B7:D, "pop", "year", "countries_etc", 'data:pop:year:countries_etc'!A1:D)
 *
 * @param {A1:D} column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param {"UN members since"} property_or_concept_id Either the property ("UN member since") or concept id ("pop") of which value to look up
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param {"countries_etc"} geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param {'data:pop:year:countries_etc'!A1:D} property_or_concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_DATA = function(
  column_or_table_range_with_headers: string[][],
  property_or_concept_id: string,
  time_unit: string,
  geography: string,
  property_or_concept_data_table_range_with_headers: string[][]
) {
  return GM_DATA(
    column_or_table_range_with_headers,
    property_or_concept_id,
    time_unit,
    geography,
    property_or_concept_data_table_range_with_headers
  );
};

/**
 * Checks if the referenced data is available remotely for use by GM_* functions.
 *
 * Runs the basic validation checks against the referenced dataset making sure that
 *  - it is listed in the fasttrack catalog
 *  - the relevant "data-" worksheet in the dataset source document is published
 *
 * Returns "GOOD" or "BAD" (Or "BAD: What is bad... " if the verbose flag is TRUE).
 *
 * Note: The function results are not automatically re-evaluated as changes are made to the source documents or the catalog. You can trigger a manual update by deleting the cell and undoing the deletion immediately.
 *
 * @param {"pop"} concept_id The concept id ("pop") of which concept data to check status for
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept data to check status for
 * @param {"countries_etc"} geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param {FALSE} verbose Explains how a certain dataset is invalid instead of simply returning "BAD" for the row
 * @customfunction
 */
(global as any).GM_DATASET_CATALOG_STATUS = function(
  concept_id: string,
  time_unit: string,
  geography: string,
  verbose: boolean
) {
  return GM_DATASET_CATALOG_STATUS(concept_id, time_unit, geography, verbose);
};

/**
 * Evaluates if the referenced dataset is set up according to the standard format and complete:
 * - Checks the row header of the output sheets ( the so called "data-countries-etc/world/region-by year)
 * - Checks the about sheet (to see if it follows the requirements in col A)
 * Returns "GOOD" or "BAD: What is bad...".
 *
 * @param {"'ABOUT'!A2:J"} about_sheet_range_except_the_title_row Local spreadsheet range referencing the ABOUT sheet contents except the header row (where this function is expected to be used).
 * @param {"'data-for-world-by-year'!A:F"} data_for_world_by_year_sheet_range Local spreadsheet range referencing the "world-by-year" concept data sheet.
 * @param {"'data-for-regions-by-year'!A:F"} data_for_regions_by_year_sheet_range Local spreadsheet range referencing the "regions-by-year" concept data sheet.
 * @param {"'data-for-countries-etc-by-year'!A:F"} data_for_countries_etc_by_year_range_sheet_range Local spreadsheet range referencing the "countries-etc-by-year" concept data sheet.
 * @customfunction
 */
(global as any).GM_DATASET_VALIDATION = function(
  about_sheet_range_except_the_title_row: string[][],
  data_for_world_by_year_sheet_range: string[][],
  data_for_regions_by_year_sheet_range: string[][],
  data_for_countries_etc_by_year_range_sheet_range: string[][]
) {
  return GM_DATASET_VALIDATION(
    about_sheet_range_except_the_title_row,
    data_for_world_by_year_sheet_range,
    data_for_regions_by_year_sheet_range,
    data_for_countries_etc_by_year_range_sheet_range
  );
};

/**
 * Inserts a table with Gapminder’s geo ids together with their aliases (all spellings we have seen before), including lower cased
 * variants without diacritics and special characters to allow for somewhat fuzzy matching.
 *
 * To be used as the source range for VLOOKUP where the dataset is too large for GM_ID or GM_NAME to be used directly.
 *
 * @param {"countries_etc"} geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @customfunction
 */
(global as any).GM_GEO_LOOKUP_TABLE = function(geography: string) {
  return GM_GEO_LOOKUP_TABLE(geography);
};

/**
 * Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.
 *
 * Note: Uses GM_DATA internally. Performance-related documentation about GM_DATA applies.
 *
 * @param {A1:D} table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param {"pop"} concept_id The concept id ("pop") of which value to look up
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param {"countries_etc"} geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param {'data:pop:year:countries_etc'!A1:D} concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_GROWTH = function(
  table_range_with_headers: string[][],
  concept_id: string,
  time_unit: string,
  geography: string,
  concept_data_table_range_with_headers: string[][]
) {
  return GM_GROWTH(
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    concept_data_table_range_with_headers
  );
};

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 * Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".
 *
 * @param {A1:A} column_range_with_headers
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param {TRUE} verbose Explains how a certain row is invalid instead of simply returning "[Invalid]" for the row
 * @customfunction
 */
(global as any).GM_ID = function(
  column_range_with_headers: string[][],
  geography: string,
  verbose: boolean
) {
  return GM_ID(column_range_with_headers, geography, verbose);
};

/**
 * Imports a standard Gapminder concept table.
 *
 * Note that using data dependencies in combination with the QUERY() function instead of GM_IMPORT() is the only performant way to include concept data in a spreadsheet.
 *
 * Takes 2-4 seconds:
 * =GM_IMPORT("pop", "year", "global")
 *
 * Almost instant:
 * =QUERY('data:pop:year:global'!A1:D)
 *
 * Always yields "Error: Result too large" since the "countries_etc" version of the dataset is rather large:
 * =GM_IMPORT("pop", "year", "countries_etc")
 *
 * Finishes in 3-10 seconds:
 * =QUERY('data:pop:year:countries_etc'!A1:D)
 *
 * @param {"pop"} concept_id Concept id (eg. "pop") of which concept to import
 * @param {"year"} time_unit Time unit variant (eg. "year") of the concept to import
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
(global as any).GM_IMPORT = function(
  concept_id: string,
  time_unit: string,
  geography: string
) {
  return GM_IMPORT(concept_id, time_unit, geography);
};

/**
 * Interpolates an input table, inserting a sorted table with additional rows, where the gaps (missing rows or empty values) in the input table have been filled in. This function works on data with two primary key columns: usually geo and time. (If we want to use this on data that has more keys: geo, time, age, gender, etc - we need a different formula)
 *
 * The range must be four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be interpolated
 *
 * @param {A1:D} table_range_with_headers
 * @param {"linear"} method Optional. linear (default), growth, flat_forward, flat_backward
 * @customfunction
 */
(global as any).GM_INTERPOLATE = function(
  table_range_with_headers: string[][],
  method: string
) {
  return GM_INTERPOLATE(table_range_with_headers, method);
};

/**
 * Inserts a column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 * Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".
 *
 * @param {A1:A} column_range_with_headers
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param {TRUE} verbose Explains how a certain row is invalid instead of simply returning "[Invalid]" for the row
 * @customfunction
 */
(global as any).GM_NAME = function(
  column_range_with_headers: string[][],
  geography: string,
  verbose: boolean
) {
  return GM_NAME(column_range_with_headers, geography, verbose);
};

/**
 * Divides the concept-value column(s) of the input table range by the population of the geography.
 *
 * Note: Uses GM_DATA internally. Performance-related documentation about GM_DATA applies.
 *
 * @param {A1:D} table_range_with_headers_and_concept_values A table range including [geo,name,time,concept-values...]
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param {"countries_etc"} geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param {'data:pop:year:countries_etc'!A1:D} population_concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the population concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_PER_CAP = function(
  table_range_with_headers_and_concept_values: string[][],
  time_unit: string,
  geography: string,
  population_concept_data_table_range_with_headers: string[][]
) {
  return GM_PER_CAP(
    table_range_with_headers_and_concept_values,
    time_unit,
    geography,
    population_concept_data_table_range_with_headers
  );
};

/**
 * Unpivots a standard pivoted Gapminder table [geo, name, ...time-values-across-columns], converting the data column headers into time units and the column values as concept values.
 *
 * @param {A1:D} table_range_with_headers The table range to unpivot
 * @param {"year"} time_label (Optional with default "time") the header label to use for the time column
 * @param {"Income level"} value_label (Optional with default "value") the header label to use for the value column
 * @customfunction
 */
(global as any).GM_UNPIVOT = function(
  table_range_with_headers: string[][],
  time_label: string,
  value_label: string
) {
  return GM_UNPIVOT(table_range_with_headers, time_label, value_label);
};
