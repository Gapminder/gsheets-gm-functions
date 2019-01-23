/**
 * This file is built and pushed to Google Scripts using the source code and tools at https://github.com/Gapminder/gsheets-gm-functions
 */

import { GM_AGGR } from "./GM_AGGR";
import { GM_DATA } from "./GM_DATA";
import { GM_ID } from "./GM_ID";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";
import { GM_NAME } from "./GM_NAME";

/* tslint:disable:only-arrow-functions */

// Expose as custom functions (picked up by gas-webpack-plugin).
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
 * @param {A1:A1000} table_range_with_headers
 * @param {"four_regions"} aggregation_prop Aggregation property
 * @param {"countries_etc"} key_concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc”
 * @customfunction
 */
(global as any).GM_AGGR = function(
  table_range_with_headers: string[][],
  aggregation_prop: string,
  key_concept_id: string
) {
  return GM_AGGR(table_range_with_headers, aggregation_prop, key_concept_id);
};

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {"countries_etc"} concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in the "geo aliases and synonyms" workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states )
 * @customfunction
 */
(global as any).GM_ID = function(
  column_range_with_headers: string[][],
  concept_id: string
) {
  return GM_ID(column_range_with_headers, concept_id);
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
 * @param {A1:A1000} table_range_with_headers
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
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {"countries_etc"} concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc”
 * @customfunction
 */
(global as any).GM_NAME = function(
  column_range_with_headers: string[][],
  concept_id: string
) {
  return GM_NAME(column_range_with_headers, concept_id);
};

/**
 * Inserts a property column, including a header row, with a common Gapminder property matched against the input column range.
 *
 * @param {A1:A1000} column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param {"UN members since"} value_property_or_concept_id Either the property ("UN member since") or concept id ("pop") of which value to look up
 * @param {"countries_etc"} key_concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc”
 * @customfunction
 */
(global as any).GM_DATA = function(
  column_or_table_range_with_headers: string[][],
  value_property_or_concept_id: string,
  key_concept_id: string
) {
  return GM_DATA(
    column_or_table_range_with_headers,
    value_property_or_concept_id,
    key_concept_id
  );
};
