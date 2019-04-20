/**
 * This file is built and pushed to Google Scripts using the source code and tools at https://github.com/Gapminder/gsheets-gm-functions
 * Note: Global functions must be exposed to the (global as any) object, or it will not be picked up by gas-webpack-plugin.
 */

import { GM_DATA } from "./GM_DATA";
import { GM_DATA_SLOW } from "./GM_DATA_SLOW";
import { GM_DATASET_CATALOG_STATUS } from "./GM_DATASET_CATALOG_STATUS";
import { GM_GEO_LOOKUP_TABLE } from "./GM_GEO_LOOKUP_TABLE";
import { GM_GROWTH } from "./GM_GROWTH";
import { GM_GROWTH_SLOW } from "./GM_GROWTH_SLOW";
import { GM_ID } from "./GM_ID";
import { GM_IMPORT_SLOW } from "./GM_IMPORT_SLOW";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";
import { GM_NAME } from "./GM_NAME";
import { GM_PER_CAP } from "./GM_PER_CAP";
import { GM_PER_CAP_SLOW } from "./GM_PER_CAP_SLOW";
import { GM_PROP } from "./GM_PROP";
import { GM_PROP_AGGR } from "./GM_PROP_AGGR";
import { GM_UNPIVOT } from "./GM_UNPIVOT";
import { menuRefreshDataCatalog } from "./menuActions/menuRefreshDataCatalog";
import { menuRefreshDataDependencies } from "./menuActions/menuRefreshDataDependencies";
import { menuValidateDatasetSpreadsheet } from "./menuActions/menuValidateDatasetSpreadsheet";

/* tslint:disable:only-arrow-functions */

// Configure custom menus

(global as any).onOpen = function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Gapminder Data");
  menu.addItem(
    `Import/refresh data dependencies`,
    "menuRefreshDataDependencies"
  );
  menu.addItem(`Refresh data catalog`, "menuRefreshDataCatalog");
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
(global as any).menuRefreshDataCatalog = menuRefreshDataCatalog;
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
 * Inserts a concept column, including a header row, with a common Gapminder concept matched against the input column/table range.
 *
 * Note: Requires that the concept data to match against is first imported using the "Gapminder Data -> Import/refresh data dependencies".
 *
 * @param {A1:D} input_table_range_with_headers The input table range including [geo,name,time] for a concept value lookup
 * @param {'data:pop@fasttrack:year:countries_etc'!A1:D} concept_data_table_range_with_headers Local spreadsheet range of the property or concept data to look up against. Required for performance reasons.
 * @customfunction
 */
(global as any).GM_DATA = function(
  input_table_range_with_headers: string[][],
  concept_data_table_range_with_headers: string[][]
) {
  return GM_DATA(
    input_table_range_with_headers,
    concept_data_table_range_with_headers
  );
};

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.
 *
 * Imports the corresponding data on-the-fly. Note that using GM_DATA is the only performant way to join concept data in a spreadsheet.
 *
 * Takes 10-20 seconds:
 * =GM_DATA_SLOW(B7:D, "pop", "year", "countries_etc")
 *
 * Takes 2-4 seconds:
 * =GM_DATA(B7:D, 'data:pop@fasttrack:year:countries_etc'!A1:D)
 *
 * @param {A1:D} column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param {"UN members since"} concept_id The concept id ("pop") of which value to look up
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @customfunction
 */
(global as any).GM_DATA_SLOW = function(
  column_or_table_range_with_headers: string[][],
  concept_id: string,
  time_unit: string,
  geo_set: string
) {
  return GM_DATA_SLOW(
    column_or_table_range_with_headers,
    concept_id,
    time_unit,
    geo_set
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
 * @param {"pop"} dataset_reference The dataset reference in the form of {concept id}@{catalog} (eg "pop@fasttrack", or "pop@opennumbers") of which concept data to check status for
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept data to check status for
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @param {FALSE} verbose Explains how a certain dataset is invalid instead of simply returning "BAD" for the row
 * @customfunction
 */
(global as any).GM_DATASET_CATALOG_STATUS = function(
  dataset_reference: string,
  time_unit: string,
  geo_set: string,
  verbose: boolean
) {
  return GM_DATASET_CATALOG_STATUS(
    dataset_reference,
    time_unit,
    geo_set,
    verbose
  );
};

/**
 * Inserts a table with Gapminder’s geo ids together with their aliases (all spellings we have seen before), including lower cased
 * variants without diacritics and special characters to allow for somewhat fuzzy matching.
 *
 * To be used as the source range for VLOOKUP where the dataset is too large for GM_ID or GM_NAME to be used directly.
 *
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @customfunction
 */
(global as any).GM_GEO_LOOKUP_TABLE = function(geo_set: string) {
  return GM_GEO_LOOKUP_TABLE(geo_set);
};

/**
 * Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.
 *
 * Note: Uses GM_DATA internally
 *
 * @param {A1:D} input_table_range_with_headers A table range including [geo,name,time] to be used for a concept value lookup
 * @param {'data:pop@fasttrack:year:countries_etc'!A1:D} concept_data_table_range_with_headers Local spreadsheet range of the concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_GROWTH = function(
  input_table_range_with_headers: string[][],
  concept_data_table_range_with_headers: string[][]
) {
  return GM_GROWTH(
    input_table_range_with_headers,
    concept_data_table_range_with_headers
  );
};

/**
 * Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.
 *
 * Note: Uses GM_DATA_SLOW internally. Performance-related documentation about GM_DATA_SLOW applies.
 *
 * @param {A1:D} input_table_range_with_headers A table range including [geo,name,time] to be used for a concept value lookup
 * @param {"pop"} concept_id The concept id ("pop") of which value to look up
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @customfunction
 */
(global as any).GM_GROWTH_SLOW = function(
  input_table_range_with_headers: string[][],
  concept_id: string,
  time_unit: string,
  geo_set: string
) {
  return GM_GROWTH_SLOW(
    input_table_range_with_headers,
    concept_id,
    time_unit,
    geo_set
  );
};

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geo_set you want to identify.
 * Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".
 *
 * @param {A1:A} column_range_with_headers
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @param {TRUE} verbose (Optional with default "FALSE") Explains how a certain row is invalid instead of simply returning "[Invalid]" for the row
 * @customfunction
 */
(global as any).GM_ID = function(
  column_range_with_headers: string[][],
  geo_set: string,
  verbose: boolean
) {
  return GM_ID(column_range_with_headers, geo_set, verbose);
};

/**
 * Imports a standard Gapminder concept table.
 *
 * Note that using data dependencies in combination with the QUERY() function instead of GM_IMPORT_SLOW() is the only performant way to include concept data in a spreadsheet.
 *
 * Takes 2-4 seconds:
 * =GM_IMPORT_SLOW("pop", "year", "global")
 *
 * Almost instant:
 * =QUERY('data:pop@fasttrack:year:global'!A1:D)
 *
 * Always yields "Error: Result too large" since the "countries_etc" version of the dataset is rather large:
 * =GM_IMPORT_SLOW("pop", "year", "countries_etc")
 *
 * Finishes in 3-10 seconds:
 * =QUERY('data:pop@fasttrack:year:countries_etc'!A1:D)
 *
 * @param {"pop"} concept_id Concept id (eg. "pop") of which concept to import
 * @param {"year"} time_unit Time unit variant (eg. "year") of the concept to import
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
(global as any).GM_IMPORT_SLOW = function(
  concept_id: string,
  time_unit: string,
  geo_set: string
) {
  return GM_IMPORT_SLOW(concept_id, time_unit, geo_set);
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
 * @param {A1:D} input_table_range_with_headers
 * @param {"linear"} method Optional. linear (default), growth, flat_forward, flat_backward
 * @customfunction
 */
(global as any).GM_INTERPOLATE = function(
  input_table_range_with_headers: string[][],
  method: string
) {
  return GM_INTERPOLATE(input_table_range_with_headers, method);
};

/**
 * Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 * Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".
 *
 * @param {A1:A} column_range_with_headers
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @param {TRUE} verbose (Optional with default "FALSE") Explains how a certain row is invalid instead of simply returning "[Invalid]" for the row
 * @customfunction
 */
(global as any).GM_NAME = function(
  column_range_with_headers: string[][],
  geo_set: string,
  verbose: boolean
) {
  return GM_NAME(column_range_with_headers, geo_set, verbose);
};

/**
 * Divides the concept-value column(s) of the input table range by the population of the geo_set.
 *
 * Note: Uses GM_DATA internally
 *
 * @param {A1:D} input_table_range_with_headers_and_concept_values A table range including [geo,name,time,concept-values...]
 * @param {'data:pop@fasttrack:year:countries_etc'!A1:D} population_concept_data_table_range_with_headers Local spreadsheet range of the population concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_PER_CAP = function(
  input_table_range_with_headers_and_concept_values: string[][],
  population_concept_data_table_range_with_headers: string[][]
) {
  return GM_PER_CAP(
    input_table_range_with_headers_and_concept_values,
    population_concept_data_table_range_with_headers
  );
};

/**
 * Divides the concept-value column(s) of the input table range by the population of the geo_set.
 *
 * Note: Uses GM_DATA_SLOW internally. Performance-related documentation about GM_DATA_SLOW applies.
 *
 * @param {A1:D} input_table_range_with_headers_and_concept_values A table range including [geo,name,time,concept-values...]
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param {"countries_etc"} geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @customfunction
 */
(global as any).GM_PER_CAP_SLOW = function(
  input_table_range_with_headers_and_concept_values: string[][],
  time_unit: string,
  geo_set: string
) {
  return GM_PER_CAP_SLOW(
    input_table_range_with_headers_and_concept_values,
    time_unit,
    geo_set
  );
};

/**
 * Inserts a property column, including a header row, with a common Gapminder property matched against the input column/table range.
 *
 * @param input_column_range_with_headers A column range for a property lookup column
 * @param {"UN members since"} property_id The property (eg. "UN member since") or concept id (eg. "pop") of which value to look up
 * @param {'data:pop@fasttrack:year:countries_etc'!A1:D} property_data_table_range_with_headers Local spreadsheet range of the property or concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_PROP = function(
  input_column_range_with_headers: string[][],
  property_id: string,
  property_data_table_range_with_headers: string[][]
) {
  return GM_PROP(
    input_column_range_with_headers,
    property_id,
    property_data_table_range_with_headers
  );
};

/**
 * Aggregates an input table by a time-independent property and time, returning a table with the aggregated values of the input table.
 *
 * The input table must be at least four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * @param {A1:D} input_table_range_with_headers
 * @param {"four_regions"} aggregation_property_id Aggregation property
 * @param {'data:pop@fasttrack:year:countries_etc'!A1:D} property_data_table_range_with_headers Local spreadsheet range of the property or concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_PROP_AGGR = function(
  input_table_range_with_headers: string[][],
  aggregation_property_id: string,
  property_data_table_range_with_headers: string[][]
) {
  return GM_PROP_AGGR(
    input_table_range_with_headers,
    aggregation_property_id,
    property_data_table_range_with_headers
  );
};

/**
 * Unpivots a standard pivoted Gapminder table [geo, name, ...time-values-across-columns], converting the data column headers into time units and the column values as concept values.
 *
 * @param {A1:D} input_table_range_with_headers The table range to unpivot
 * @param {"year"} time_label (Optional with default "time") the header label to use for the time column
 * @param {"Income level"} value_label (Optional with default "value") the header label to use for the value column
 * @customfunction
 */
(global as any).GM_UNPIVOT = function(
  input_table_range_with_headers: string[][],
  time_label: string,
  value_label: string
) {
  return GM_UNPIVOT(input_table_range_with_headers, time_label, value_label);
};
