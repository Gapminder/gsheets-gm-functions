import { exponential, linear } from "everpolate";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";
import { GM_NAME } from "./GM_NAME";
import { GM_PROP } from "./GM_PROP";
import {
  GmTable,
  GmTableRow,
  GmTableRowsByGeoAndTime
} from "./gmTableStructure";
import { gapminderPropertyToConceptIdMap } from "./hardcodedConstants";
import { pipe } from "./pipe";

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
 * @param prop Aggregation property
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_AGGR(table_range_with_headers: string[][], prop: string) {
  // Clone the input param to prevent side effects
  const inputTable = table_range_with_headers.concat([]);

  // Add aggregation property value and name columns to input table
  const geoColumnWithHeaderRow = inputTable.map(row => [row[0]]);
  const aggregationPropertyColumnWithHeaderRow = GM_PROP(
    geoColumnWithHeaderRow,
    prop
  );
  const aggregationPropertyNameColumnWithHeaderRow = gapminderPropertyToConceptIdMap[
    prop
  ]
    ? GM_NAME(
        aggregationPropertyColumnWithHeaderRow,
        gapminderPropertyToConceptIdMap[prop]
      )
    : aggregationPropertyColumnWithHeaderRow;
  const aggregationTableWithHeaders = inputTable.map((row, index) => {
    return [
      aggregationPropertyColumnWithHeaderRow[index][0],
      aggregationPropertyNameColumnWithHeaderRow[index][0],
      ...row.slice(2)
    ];
  });

  // Aggregate input table by property and time
  const outputTableRows: GmTableRow[] = [];
  const aggregationTableHeaderRow = GmTable.structureRow(
    aggregationTableWithHeaders.shift()
  );
  const aggregationTableRows = aggregationTableWithHeaders.map(
    GmTable.structureRow
  );

  const aggregatedRowsByGeoAndTime: GmTableRowsByGeoAndTime = pipe([
    groupBy("geo"),
    mapValues((geoItemGroup: GmTableRow[]) => {
      return pipe([
        groupBy("time"),
        mapValues((geoAndTimeItemGroup: GmTableRow[]) => {
          return geoAndTimeItemGroup.reduce(
            (
              aggregatingGeoAndTimeItemRow: GmTableRow,
              previousGeoAndTimeItemRow: GmTableRow
            ) => {
              const dataValuesSummedWithPrevious = [];
              const data = aggregatingGeoAndTimeItemRow.data;
              for (let i = 1; i < data.length; i++) {
                dataValuesSummedWithPrevious[i] =
                  previousGeoAndTimeItemRow[i] + data[i];
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
  ])(aggregationTableRows);

  // Build output table based on aggregation results
  const geos = Object.keys(aggregatedRowsByGeoAndTime);
  for (const geo of geos.sort()) {
    const aggregatedTableRowsByTime = aggregatedRowsByGeoAndTime[geo];
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
