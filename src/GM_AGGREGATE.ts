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
export function GM_AGGREGATE(
  table_range_with_headers: string[][],
  geo_set_name: string
) {
  return "foo";
}
