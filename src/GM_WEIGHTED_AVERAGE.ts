import { GM_DATA } from "./GM_DATA";
import {
  aggregateGapminderTableByAggregationPropertyValueAndTime,
  aggregationModes
} from "./lib/aggregateGapminderTableByAggregationPropertyValueAndTime";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { prependPropertyAndNameColumnsToGapminderTableWithHeaders } from "./lib/prependPropertyAndNameColumnsToGapminderTableWithHeaders";

/**
 * Aggregates an input table by a time-independent property and time, returning a table with the population-weighted average values of the input table.
 *
 * The input table must be at least four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * Note: Uses GM_PROP internally for the property lookup, and GM_DATA internally for the population lookup
 *
 * @param input_table_range_with_headers
 * @param aggregation_property_id Aggregation property
 * @param population_concept_data_table_range_with_headers Local spreadsheet range of the population concept data to look up against. Required for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_WEIGHTED_AVERAGE(
  input_table_range_with_headers: string[][],
  aggregation_property_id: string,
  population_concept_data_table_range_with_headers: string[][]
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );

  // Population data
  const populationGmDataResult: any[][] = GM_DATA(
    inputTable,
    population_concept_data_table_range_with_headers
  );

  // Add aggregation property value and aggregation property name columns to the left side of the input table
  const tableWithHeadersAndPropertyAndNameColumnsPrepended = prependPropertyAndNameColumnsToGapminderTableWithHeaders(
    inputTable,
    aggregation_property_id
  );

  // Prepend the weights column (the population of each geo and time) to the left side of the aggregation table
  const aggregationTableWithWeightsColumnPrepended = tableWithHeadersAndPropertyAndNameColumnsPrepended.map(
    (row, index) => {
      if (populationGmDataResult[index] === undefined) {
        throw new Error(
          `The populationGmDataResult at index ${index} is undefined`
        );
      }
      return [populationGmDataResult[index][0], ...row];
    }
  );

  // Aggregate input table by property and time using weighted average as the aggregation mode
  return aggregateGapminderTableByAggregationPropertyValueAndTime(
    aggregationTableWithWeightsColumnPrepended,
    aggregationModes.WEIGHTED_MEAN
  );
}
