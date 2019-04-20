import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";
import {
  GmTable,
  GmTableRow,
  GmTableRowsByGeoAndTime
} from "../gsheetsData/gmTableStructure";
import { pipe } from "./pipe";

/**
 * @hidden
 */
export function aggregateGapminderTableByMainColumnAndTime(
  aggregationTableWithHeaders
) {
  // Note: References to "Geo" below are references to the property value, which is
  // placed in the position that geos usually hold in standard Gapminder tables
  // TODO: Don't use "Geo" in this context
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
