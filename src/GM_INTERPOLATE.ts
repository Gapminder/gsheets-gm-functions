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
export function GM_INTERPOLATE(
  table_range_with_headers: string[][],
  method: string
) {
  return "foo";
}
