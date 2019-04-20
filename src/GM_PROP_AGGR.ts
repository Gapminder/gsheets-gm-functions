import { GM_NAME } from "./GM_NAME";
import { GM_PROP } from "./GM_PROP";
import { gapminderPropertyToGeoSetMap } from "./gsheetsData/hardcodedConstants";
import { aggregateGapminderTableByMainColumnAndTime } from "./lib/aggregateGapminderTableByMainColumnAndTime";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Aggregates an input table by a time-independent property and time, returning a table with the aggregated values of the input table.
 *
 * The input table must be at least four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * @param input_table_range_with_headers
 * @param aggregation_property_id Aggregation property
 * @param property_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the property data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PROP_AGGR(
  input_table_range_with_headers: string[][],
  aggregation_property_id: string,
  property_data_table_range_with_headers: string[][]
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );

  // Add aggregation property value and name columns to input table
  const geoColumnWithHeaderRow = inputTable.map(row => [row[0]]);
  const aggregationPropertyColumnWithHeaderRow = GM_PROP(
    geoColumnWithHeaderRow,
    aggregation_property_id,
    property_data_table_range_with_headers
  );
  const aggregationGeoSet =
    gapminderPropertyToGeoSetMap[aggregation_property_id];
  const aggregationPropertyNameColumnWithHeaderRow = aggregationGeoSet
    ? GM_NAME(aggregationPropertyColumnWithHeaderRow, aggregationGeoSet, true)
    : aggregationPropertyColumnWithHeaderRow;
  const aggregationTableWithHeaders = inputTable.map((row, index) => {
    if (aggregationPropertyColumnWithHeaderRow[index] === undefined) {
      throw new Error(
        `The aggregationPropertyColumnWithHeaderRow at index ${index} is undefined`
      );
    }
    if (aggregationPropertyNameColumnWithHeaderRow[index] === undefined) {
      throw new Error(
        `The aggregationPropertyNameColumnWithHeaderRow at index ${index} is undefined`
      );
    }
    return [
      aggregationPropertyColumnWithHeaderRow[index][0],
      aggregationPropertyNameColumnWithHeaderRow[index][0],
      ...row.slice(2)
    ];
  });

  // Aggregate input table by property and time
  return aggregateGapminderTableByMainColumnAndTime(
    aggregationTableWithHeaders
  );
}
