import {
  aggregateGapminderTableByAggregationPropertyValueAndTime,
  aggregationModes
} from "./lib/aggregateGapminderTableByAggregationPropertyValueAndTime";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { prependPropertyAndNameColumnsToGapminderTableWithHeaders } from "./lib/prependPropertyAndNameColumnsToGapminderTableWithHeaders";

/**
 * Aggregates an input table by a time-independent property and time, returning a table with the aggregated values of the input table.
 *
 * The input table must be at least four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * Note: Uses GM_PROP internally
 *
 * @param input_table_range_with_headers
 * @param aggregation_property_id Aggregation property
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PROP_AGGR(
  input_table_range_with_headers: string[][],
  aggregation_property_id: string
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );

  // Add aggregation property value and aggregation property name columns to the left side of the input table

  const tableWithHeadersAndPropertyAndNameColumnsPrepended = prependPropertyAndNameColumnsToGapminderTableWithHeaders(
    inputTable,
    aggregation_property_id
  );

  // Aggregate input table by property and time using sum as the aggregation mode
  return aggregateGapminderTableByAggregationPropertyValueAndTime(
    tableWithHeadersAndPropertyAndNameColumnsPrepended,
    aggregationModes.SUM
  );
}
