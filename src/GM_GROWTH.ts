import { GM_DATA } from "./GM_DATA";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.
 *
 * Note: Uses GM_DATA internally
 *
 * @param input_table_range_with_headers A table range including [geo,name,time] to be used for a concept value lookup
 * @param concept_data_table_range_with_headers Local spreadsheet range of the concept data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_GROWTH(
  input_table_range_with_headers: string[][],
  concept_data_table_range_with_headers: string[][]
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );
  const inputTableRows = inputTable.map(GmTable.structureRow);
  const inputTableRowsWithoutHeaderRow = inputTableRows.slice(1);
  const inputTableRowsWithoutHeaderRowByGeoAndTime = GmTable.byGeoAndTime(
    inputTableRowsWithoutHeaderRow
  );
  // Concept data
  const gmDataResult: any[][] = GM_DATA(
    input_table_range_with_headers,
    concept_data_table_range_with_headers
  );
  const gmDataHeaderRow: string[] = gmDataResult.slice().shift();
  // Replace GM_DATA concept data with the growth over time unit in each geo
  const geos = Object.keys(inputTableRowsWithoutHeaderRowByGeoAndTime);
  const growthOverTime: number[] = [];
  for (const geo of geos) {
    const inputTableRowsByTime =
      inputTableRowsWithoutHeaderRowByGeoAndTime[geo];
    const geoTimes = Object.keys(inputTableRowsByTime).sort();
    for (let k = 0; k < geoTimes.length; k++) {
      const time = geoTimes[k];
      const inputTableRow: GmTableRow = inputTableRowsByTime[time];
      const i = inputTableRow.originalRowIndex;
      if (k === 0) {
        growthOverTime[i - 1] = undefined;
      } else {
        growthOverTime[i - 1] =
          parseFloat(gmDataResult[i][0]) / parseFloat(gmDataResult[i - 1][0]) -
          1;
      }
    }
  }
  const growthOverTimeDataColumn: any[][] = growthOverTime.map(
    (gmAnnualGrowthDataValue: number) => {
      return [gmAnnualGrowthDataValue];
    }
  );
  return [gmDataHeaderRow].concat(growthOverTimeDataColumn);
}
