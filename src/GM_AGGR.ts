import { exponential, linear } from "everpolate";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";
import { GM_DATA } from "./GM_DATA";
import { GM_NAME } from "./GM_NAME";
import {
  GmTable,
  GmTableRow,
  GmTableRowsByGeoAndTime
} from "./gsheetsData/gmTableStructure";
import { gapminderPropertyToConceptIdMap } from "./gsheetsData/hardcodedConstants";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { pipe } from "./lib/pipe";

/**
 * Aggregates an input table by property and time, returning a table with the aggregated values of the input table.
 *
 * The range must be four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * @param table_range_with_headers
 * @param aggregation_prop Aggregation property
 * @param geography Should be one of the sets listed in the gapminder geo ontology such as “countries_etc”
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_AGGR(
  table_range_with_headers: string[][],
  aggregation_prop: string,
  geography: string
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(table_range_with_headers);

  // Add aggregation property value and name columns to input table
  const geoColumnWithHeaderRow = inputTable.map(row => [row[0]]);
  const aggregationPropertyColumnWithHeaderRow = GM_DATA(
    geoColumnWithHeaderRow,
    aggregation_prop,
    undefined,
    geography,
    undefined
  );
  const aggregationPropertyNameColumnWithHeaderRow = gapminderPropertyToConceptIdMap[
    aggregation_prop
  ]
    ? GM_NAME(
        aggregationPropertyColumnWithHeaderRow,
        gapminderPropertyToConceptIdMap[aggregation_prop],
        true
      )
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
  const aggregationTableRows = aggregationTableWithHeaders.map(
    GmTable.structureRow
  );
  const aggregationTableHeaderRow = aggregationTableRows.slice().shift();
  const aggregationTableRowsWithoutHeaderRow = aggregationTableRows.slice(1);

  const aggregatedRowsByAggregationPropertyAndTime: GmTableRowsByGeoAndTime = pipe(
    [
      groupBy("geo"),
      mapValues((geoItemGroup: GmTableRow[]) => {
        return pipe([
          groupBy("time"),
          mapValues((geoAndTimeItemGroup: GmTableRow[]) => {
            // Ensure all values are interpreted as numbers (with non-numbers counted as 0) before attempting to aggregate
            const geoAndTimeItemGroupNumberValues: GmTableRow[] = geoAndTimeItemGroup.map(
              (geoAndTimeItemRow: GmTableRow): GmTableRow => {
                return {
                  ...geoAndTimeItemRow,
                  data: geoAndTimeItemRow.data.map(value => {
                    const numberValue = parseFloat(value);
                    return isNaN(numberValue) ? 0 : numberValue;
                  })
                };
              }
            );
            // Aggregate
            return geoAndTimeItemGroupNumberValues.reduce(
              (
                aggregatingGeoAndTimeItemRow: GmTableRow,
                previousGeoAndTimeItemRow: GmTableRow
              ) => {
                const dataValuesSummedWithPrevious = [];
                const data = aggregatingGeoAndTimeItemRow.data;
                for (let colIndex = 0; colIndex < data.length; colIndex++) {
                  dataValuesSummedWithPrevious[colIndex] =
                    parseFloat(previousGeoAndTimeItemRow.data[colIndex]) +
                    parseFloat(data[colIndex]);
                }
                return {
                  ...aggregatingGeoAndTimeItemRow,
                  data: dataValuesSummedWithPrevious
                };
              }
            );
          })
        ])(geoItemGroup);
      })
    ]
  )(aggregationTableRowsWithoutHeaderRow);

  // Build output table based on aggregation results
  const outputTableRows: GmTableRow[] = [];
  const geos = Object.keys(aggregatedRowsByAggregationPropertyAndTime);
  for (const geo of geos.sort()) {
    const aggregatedTableRowsByTime =
      aggregatedRowsByAggregationPropertyAndTime[geo];
    const geoTimes = Object.keys(aggregatedTableRowsByTime);
    for (const time of geoTimes.sort()) {
      const outputTableRow: GmTableRow = aggregatedTableRowsByTime[time];
      outputTableRows.push(outputTableRow);
    }
  }

  return [aggregationTableHeaderRow]
    .concat(outputTableRows)
    .map(GmTable.unstructureRow);
}
