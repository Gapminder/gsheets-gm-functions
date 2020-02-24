import { orderBy } from "lodash";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";
import weightedMean from "weighted-mean";
import {
  GmAggregationTableRow,
  GmTable,
  GmTableAggregationRowsByAggregationPropertyValueAndTime,
  GmWeightedAggregationTableRow
} from "../gsheetsData/gmTableStructure";
import { pipe } from "./pipe";

/**
 * @hidden
 */
export const aggregationModes = {
  SUM: "sum",
  WEIGHTED_MEAN: "weighted-mean"
};

/**
 * @param aggregationTableWithHeaders Either an aggregation table (for SUM aggregation) or a weighted aggregation table (for WEIGHTED_MEAN aggregation). A weighted aggregation table is an ordinary aggregation table which is an ordinary aggregation table with an additional (added as the first column) column with the weights to be used
 * @param aggregationMode
 * @hidden
 */
export function aggregateGapminderTableByAggregationPropertyValueAndTime(
  aggregationTableWithHeaders,
  aggregationMode
) {
  if (!aggregationMode) {
    aggregationMode = aggregationModes.SUM;
  }
  let aggregationTableRows;
  let groupAggregator;
  switch (aggregationMode) {
    case aggregationModes.SUM:
      aggregationTableRows = aggregationTableWithHeaders.map(
        GmTable.structureAggregationRow
      );
      groupAggregator = (
        aggregationPropertyValueAndTimeItemGroup: GmAggregationTableRow[]
      ) => {
        // Ensure all values are interpreted as numbers (with non-numbers counted as 0) before attempting to aggregate
        const aggregationPropertyValueAndTimeItemGroupNumberValues: GmAggregationTableRow[] = aggregationPropertyValueAndTimeItemGroup.map(
          ensureGmAggregationTableRowDataValuesAreNumbers
        );
        // Aggregate
        return aggregationPropertyValueAndTimeItemGroupNumberValues.reduce(
          (
            aggregatingAggregationPropertyValueAndTimeItemRow: GmAggregationTableRow,
            previousAggregationPropertyValueAndTimeItemRow: GmAggregationTableRow
          ) => {
            const dataValuesSummedWithPrevious = [];
            const data = aggregatingAggregationPropertyValueAndTimeItemRow.data;
            for (let colIndex = 0; colIndex < data.length; colIndex++) {
              dataValuesSummedWithPrevious[colIndex] =
                parseFloat(
                  previousAggregationPropertyValueAndTimeItemRow.data[colIndex]
                ) + parseFloat(data[colIndex]);
            }
            return {
              ...aggregatingAggregationPropertyValueAndTimeItemRow,
              data: dataValuesSummedWithPrevious
            };
          }
        );
      };
      break;
    case aggregationModes.WEIGHTED_MEAN:
      aggregationTableRows = aggregationTableWithHeaders.map(
        GmTable.structureWeightedAggregationRow
      );
      groupAggregator = groupAggregator = (
        aggregationPropertyValueAndTimeItemGroup: GmAggregationTableRow[]
      ) => {
        // Ensure all values are interpreted as numbers (with non-numbers counted as 0) before attempting to aggregate
        const aggregationPropertyValueAndTimeItemGroupNumberValues: GmAggregationTableRow[] = aggregationPropertyValueAndTimeItemGroup.map(
          ensureGmAggregationTableRowDataValuesAreNumbers
        );
        // Aggregate
        const columnValuesAndWeightsByColIndex: number[][][] = [];
        aggregationPropertyValueAndTimeItemGroupNumberValues.map(
          (
            aggregationPropertyValueAndTimeItemRow: GmWeightedAggregationTableRow
          ) => {
            const dataValuesSummedWithPrevious = [];
            const data = aggregationPropertyValueAndTimeItemRow.data;
            for (let colIndex = 0; colIndex < data.length; colIndex++) {
              if (
                typeof columnValuesAndWeightsByColIndex[colIndex] ===
                "undefined"
              ) {
                columnValuesAndWeightsByColIndex[colIndex] = [];
              }
              columnValuesAndWeightsByColIndex[colIndex].push([
                aggregationPropertyValueAndTimeItemRow.data[colIndex],
                aggregationPropertyValueAndTimeItemRow.weight
              ]);
            }
            return {
              ...aggregationPropertyValueAndTimeItemRow,
              data: dataValuesSummedWithPrevious
            };
          }
        );
        return {
          ...aggregationPropertyValueAndTimeItemGroup[0],
          data: columnValuesAndWeightsByColIndex.map(weightedMean)
        };
      };
      break;
    default:
      throw new Error(`Unknown aggregation mode: "${aggregationMode}"`);
  }

  const aggregationTableHeaderRow = aggregationTableRows.slice().shift();
  const aggregationTableRowsWithoutHeaderRow = aggregationTableRows.slice(1);

  const aggregatedRowsByAggregationPropertyAndTime: GmTableAggregationRowsByAggregationPropertyValueAndTime = pipe(
    [
      groupBy("aggregationPropertyValue"),
      mapValues(
        (aggregationPropertyValueItemGroup: GmAggregationTableRow[]) => {
          return pipe([groupBy("time"), mapValues(groupAggregator)])(
            aggregationPropertyValueItemGroup
          );
        }
      )
    ]
  )(aggregationTableRowsWithoutHeaderRow);

  // Build output table based on aggregation results
  const outputAggregationTableRows: GmAggregationTableRow[] = [];
  const aggregationPropertyValues = Object.keys(
    aggregatedRowsByAggregationPropertyAndTime
  );
  for (const aggregationPropertyValue of aggregationPropertyValues.sort()) {
    const aggregatedTableRowsByTime =
      aggregatedRowsByAggregationPropertyAndTime[aggregationPropertyValue];
    const aggregationPropertyValueTimes = Object.keys(
      aggregatedTableRowsByTime
    );
    for (const time of aggregationPropertyValueTimes.sort()) {
      const outputTableRow: GmAggregationTableRow =
        aggregatedTableRowsByTime[time];
      outputAggregationTableRows.push(outputTableRow);
    }
  }

  // default sort by aggregation property name and year
  const sortedOutputAggregationTableRows = orderBy(
    outputAggregationTableRows,
    ["aggregationPropertyName", "time"],
    ["asc", "asc"]
  );

  return [aggregationTableHeaderRow]
    .concat(sortedOutputAggregationTableRows)
    .map(GmTable.unstructureAggregationRow);
}

/**
 * @hidden
 */
const ensureGmAggregationTableRowDataValuesAreNumbers = (
  aggregationPropertyValueAndTimeItemRow: GmAggregationTableRow
): GmAggregationTableRow => {
  return {
    ...aggregationPropertyValueAndTimeItemRow,
    data: aggregationPropertyValueAndTimeItemRow.data.map(value => {
      const numberValue = parseFloat(value);
      return isNaN(numberValue) ? 0 : numberValue;
    })
  };
};
