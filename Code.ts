/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {string} concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in the "geo aliases and synonyms" workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states ) TODO: Make optional
 * @customfunction
 */
function GM_ID(column_range_with_headers, concept_id) {
  return "foo";
}

/**
 * Inserts a column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {string} concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in this workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states ) TODO: Make optional
 * @customfunction
 */
function GM_NAME(column_range_with_headers, concept_id) {
  return "foo";
}

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
 * @param {string} method Optional. linear, growth, flat_forward, flat_backward
 * @customfunction
 */
function GM_INTERPOLATE(table_range_with_headers, method) {
  return "foo";
}

/**
 * Inserts a property column, including a header row, with a common Gapminder property matched against the input column range.
 * 
 * @param {A1:A1000} column_range_with_headers
 * @param {string} prop
 * @customfunction
 */
function GM_PROP(column_range_with_headers, prop) {
  return "foo";
}

/**
 * Aggregates an input table, returning a table with the aggregated values of the input table.
 * 
 * The range must be four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * @param {A1:A1000} table_range_with_headers
 * @param {string} geo_set_name
 * @customfunction
 */
function GM_AGGREGATE(table_range_with_headers, geo_set_name) {
  return "foo";
}
