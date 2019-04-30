import { GM_DATA } from "./GM_DATA";
import {
  aggregateGapminderTableByAggregationPropertyValueAndTime,
  aggregationModes
} from "./lib/aggregateGapminderTableByAggregationPropertyValueAndTime";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Aggregates an input table by a time-dependent indicator and time, returning a table with the aggregated values of the input table.
 *
 * The input table must be at least four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * Note: Uses GM_DATA internally
 *
 * @param input_table_range_with_headers
 * @param concepts_data_table_range_with_headers Local spreadsheet range (imported using data-dependencies) of the concepts' data to look up against. Required for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA_AGGR(
  input_table_range_with_headers: string[][],
  concepts_data_table_range_with_headers: string[][]
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );
  // Add aggregation property value and aggregation property name columns to the left side of the input table
  const aggregationConceptColumnWithHeaderRow = GM_DATA(
    inputTable,
    concepts_data_table_range_with_headers
  );

  const aggregationTableWithHeaders = inputTable.map((row, index) => {
    if (aggregationConceptColumnWithHeaderRow[index] === undefined) {
      throw new Error(
        `The aggregationConceptColumnWithHeaderRow at index ${index} is undefined`
      );
    }
    return [
      aggregationConceptColumnWithHeaderRow[index][0],
      aggregationConceptColumnWithHeaderRow[index][0],
      ...row
    ];
  });

  // Aggregate input table by property and time
  return aggregateGapminderTableByAggregationPropertyValueAndTime(
    aggregationTableWithHeaders,
    aggregationModes.SUM
  );
}
