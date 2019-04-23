import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";
import {
  GmAggregationTableRow,
  GmTable,
  GmTableAggregationRowsByAggregationPropertyValueAndTime
} from "../gsheetsData/gmTableStructure";
import { pipe } from "./pipe";

/**
 * @hidden
 */
export const aggregationModes = {
  SUM: "sum"
};

/**
 * @hidden
 */
export function aggregateGapminderTableByAggregationPropertyValueAndTime(
  aggregationTableWithHeaders,
  aggregationMode
) {
  if (!aggregationMode) {
    aggregationMode = aggregationModes.SUM;
  }
  const aggregationTableRows = aggregationTableWithHeaders.map(
    GmTable.structureAggregationRow
  );
  const aggregationTableHeaderRow = aggregationTableRows.slice().shift();
  const aggregationTableRowsWithoutHeaderRow = aggregationTableRows.slice(1);

  const aggregatedRowsByAggregationPropertyAndTime: GmTableAggregationRowsByAggregationPropertyValueAndTime = pipe(
    [
      groupBy("aggregationPropertyValue"),
      mapValues(
        (aggregationPropertyValueItemGroup: GmAggregationTableRow[]) => {
          return pipe([
            groupBy("time"),
            mapValues(
              (
                aggregationPropertyValueAndTimeItemGroup: GmAggregationTableRow[]
              ) => {
                // Ensure all values are interpreted as numbers (with non-numbers counted as 0) before attempting to aggregate
                const aggregationPropertyValueAndTimeItemGroupNumberValues: GmAggregationTableRow[] = aggregationPropertyValueAndTimeItemGroup.map(
                  (
                    aggregationPropertyValueAndTimeItemRow: GmAggregationTableRow
                  ): GmAggregationTableRow => {
                    return {
                      ...aggregationPropertyValueAndTimeItemRow,
                      data: aggregationPropertyValueAndTimeItemRow.data.map(
                        value => {
                          const numberValue = parseFloat(value);
                          return isNaN(numberValue) ? 0 : numberValue;
                        }
                      )
                    };
                  }
                );
                // Aggregate
                return aggregationPropertyValueAndTimeItemGroupNumberValues.reduce(
                  (
                    aggregatingAggregationPropertyValueAndTimeItemRow: GmAggregationTableRow,
                    previousAggregationPropertyValueAndTimeItemRow: GmAggregationTableRow
                  ) => {
                    const dataValuesSummedWithPrevious = [];
                    const data =
                      aggregatingAggregationPropertyValueAndTimeItemRow.data;
                    for (let colIndex = 0; colIndex < data.length; colIndex++) {
                      dataValuesSummedWithPrevious[colIndex] =
                        parseFloat(
                          previousAggregationPropertyValueAndTimeItemRow.data[
                            colIndex
                          ]
                        ) + parseFloat(data[colIndex]);
                    }
                    return {
                      ...aggregatingAggregationPropertyValueAndTimeItemRow,
                      data: dataValuesSummedWithPrevious
                    };
                  }
                );
              }
            )
          ])(aggregationPropertyValueItemGroup);
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

  return [aggregationTableHeaderRow]
    .concat(outputAggregationTableRows)
    .map(GmTable.unstructureAggregationRow);
}
