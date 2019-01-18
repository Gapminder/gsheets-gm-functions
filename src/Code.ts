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
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 * @customfunction
 */
function GM_AGGREGATE(
  table_range_with_headers: string[][],
  geo_set_name: string
) {
  return "foo";
}

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {string} concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in the "geo aliases and synonyms" workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states ) TODO: Make optional
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 * @customfunction
 */
function GM_ID(column_range_with_headers: string[][], concept_id: string) {
  const lookupTable = getGeoAliasesAndSynonymsCountriesEtcLookupTable();

  // Drop the input range header row
  column_range_with_headers.shift();

  const matchedData = column_range_with_headers.map(inputRow => {
    const alias = inputRow[0];
    const result = lookupTable[alias];
    return [result ? result.geo : `Unknown alias: ${alias}`];
  });

  return [["geo"]].concat(matchedData);
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
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 * @customfunction
 */
function GM_INTERPOLATE(table_range_with_headers: string[][], method: string) {
  return "foo";
}

/**
 * Inserts a column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {string} concept_id Should be one of the sets listed in the gapminder geo ontology such as “countries_etc” (see the tab “geo-sets” in this workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian_states, us_states ) TODO: Make optional
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 * @customfunction
 */
function GM_NAME(column_range_with_headers: string[][], concept_id: string) {
  const lookupTable = getGeoAliasesAndSynonymsCountriesEtcLookupTable();

  // Drop the input range header row
  column_range_with_headers.shift();

  const matchedData = column_range_with_headers.map(inputRow => {
    const alias = inputRow[0];
    const result = lookupTable[alias];
    return [result ? result.name : `Unknown alias: ${alias}`];
  });

  return [["name"]].concat(matchedData);
}

/**
 * Inserts a property column, including a header row, with a common Gapminder property matched against the input column range.
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {string} prop
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 * @customfunction
 */
function GM_PROP(column_range_with_headers: string[][], prop: string) {
  const lookupTable = getDataGeographiesListOfCountriesEtcLookupTable();

  // Drop the input range header row
  column_range_with_headers.shift();

  // Convert the prop to the Gsheet-generated equivalent property (eg "UN member since" becomes "unmembersince")
  const gsxProperty = prop.toLowerCase().replace(/[^A-Za-z0-9]*/g, "");

  const matchedData = column_range_with_headers.map(inputRow => {
    const geo = inputRow[0];
    const result = lookupTable[geo];
    return [
      result
        ? result[gsxProperty]
          ? result[gsxProperty]
          : `Unknown property ${gsxProperty}`
        : `Unknown geo: ${geo}`
    ];
  });

  return [[prop]].concat(matchedData);
}
