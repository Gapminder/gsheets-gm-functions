import { exponential, fillMissing, linear, step } from "everpolate";
import range from "lodash/range";
import round from "lodash/round";
import {
  GmTable,
  GmTableRow,
  GmTableRowsByGeoAndTime
} from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Interpolates an input table, inserting a sorted table with additional rows, where the gaps (missing rows or empty values) in the input table have been filled in. This function works on data with two primary key columns: usually geo and time. (If we want to use this on data that has more keys: geo, time, age, gender, etc - we need a different formula)
 *
 * The range must be four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be interpolated
 *
 * @param input_table_range_with_headers
 * @param method Optional. linear (default), growth, flat_forward, flat_backward
 * @param page_size Optional. Used to paginate large output tables
 * @param page Optional. Used to paginate large output tables
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_INTERPOLATE(
  input_table_range_with_headers: string[][],
  method: string,
  page_size: number,
  page: number
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );
  let interpolation;
  if (!method) {
    method = "linear";
  }
  if (!page_size) {
    page_size = null;
  }
  if (!page) {
    page = null;
  }
  switch (method) {
    case "linear":
      interpolation = linear;
      break;
    case "growth":
      interpolation = exponential;
      break;
    case "flat_forward":
      interpolation = step;
      break;
    case "flat_backward":
      interpolation = (pointsToEvaluate, functionValuesX, functionValuesY) => {
        const useRightBorder = true;
        return step(
          pointsToEvaluate,
          functionValuesX,
          functionValuesY,
          useRightBorder
        );
      };
      break;
    case "zerofill":
      interpolation = (pointsToEvaluate, functionValuesX, functionValuesY) => {
        const fillValue = 0;
        return fillMissing(
          pointsToEvaluate,
          functionValuesX,
          functionValuesY,
          fillValue
        );
      };
      break;
    default:
      throw new Error(`Interpolation method "${method}" is not supported`);
  }
  const outputTableRows: GmTableRow[] = [];
  const inputTableRows = inputTable.map(GmTable.structureRow);
  const inputTableHeaderRow = inputTableRows.slice(0, 1).shift();
  const inputTableRowsWithoutHeaderRow = inputTableRows.slice(1);
  const inputTableGeoIdToGeoNameLookup = inputTableRowsWithoutHeaderRow.reduce(
    (acc, inputTableRow) => {
      acc[inputTableRow.geo] = inputTableRow.name;
      return acc;
    },
    {}
  );
  const inputTableRowsByGeoAndTime: GmTableRowsByGeoAndTime = GmTable.byGeoAndTime(
    inputTableRowsWithoutHeaderRow
  );

  interface ValuesByTime {
    [time: string]: number;
  }

  interface ValuesByColumnIndexAndTime {
    [columnIndex: number]: ValuesByTime;
  }

  const geos = Object.keys(inputTableRowsByGeoAndTime);
  for (const geo of geos) {
    const inputTableRowsByTime = inputTableRowsByGeoAndTime[geo];
    // Gather all existing values in this geo, separately for each value column to be interpolated
    const valuesByColumnIndexAndTime: ValuesByColumnIndexAndTime = {};
    const geoTimes = Object.keys(inputTableRowsByTime);
    for (const time of geoTimes.sort()) {
      const inputTableRow: GmTableRow = inputTableRowsByTime[time];
      // foreach value column
      for (
        let columnIndex = 0;
        columnIndex < inputTableRow.data.length;
        columnIndex++
      ) {
        if (!valuesByColumnIndexAndTime[columnIndex]) {
          valuesByColumnIndexAndTime[columnIndex] = {};
        }
        if (!valuesByColumnIndexAndTime[columnIndex][time]) {
          valuesByColumnIndexAndTime[columnIndex][time] = parseFloat(
            inputTableRow.data[columnIndex]
          );
        }
      }
    }
    // Interpolate
    const interpolatedValuesByColumnIndexAndTime: ValuesByColumnIndexAndTime = {};
    for (const columnIndexString of Object.keys(valuesByColumnIndexAndTime)) {
      const columnIndex = Number(columnIndexString);
      const valuesByTime = valuesByColumnIndexAndTime[columnIndex];
      const times = Object.keys(valuesByTime).map(timeString =>
        parseInt(timeString, 10)
      );
      const values = Object.keys(valuesByTime).map(
        timeString => valuesByTime[timeString]
      );
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const timesToEvaluate = range(minTime, maxTime + 1);
      if (timesToEvaluate.length > 1) {
        const interpolationResults = interpolation(
          timesToEvaluate,
          times,
          values
        );
        // Avoid floating point rounding errors such as 59.10000000000002
        const roundedInterpolationResults = interpolationResults.map(result =>
          round(result, 8)
        );
        for (let i = 0; i < timesToEvaluate.length; i++) {
          const time = timesToEvaluate[i];
          if (!interpolatedValuesByColumnIndexAndTime[columnIndex]) {
            interpolatedValuesByColumnIndexAndTime[columnIndex] = {};
          }
          if (!interpolatedValuesByColumnIndexAndTime[columnIndex][time]) {
            interpolatedValuesByColumnIndexAndTime[columnIndex][time] =
              roundedInterpolationResults[i];
          }
        }
      }
    }
    // Build output table based on interpolation results
    const numericGeoTimes = geoTimes.map(timeString => Number(timeString));
    const geoMinTime = Math.min(...numericGeoTimes);
    const geoMaxTime = Math.max(...numericGeoTimes);
    const geoTimesToIncludeInOutput = range(geoMinTime, geoMaxTime + 1).map(
      time => String(time)
    );

    for (const time of geoTimesToIncludeInOutput) {
      const data = [];
      for (
        let columnIndex = 0;
        columnIndex < inputTableHeaderRow.data.length;
        columnIndex++
      ) {
        let value;
        // If the value existed in the input data, use it
        if (
          valuesByColumnIndexAndTime[columnIndex] !== undefined &&
          valuesByColumnIndexAndTime[columnIndex][time] !== undefined
        ) {
          value = valuesByColumnIndexAndTime[columnIndex][time];
        } else {
          // Else, check for an interpolated value if any
          if (
            interpolatedValuesByColumnIndexAndTime[columnIndex] !== undefined &&
            interpolatedValuesByColumnIndexAndTime[columnIndex][time] !==
              undefined
          ) {
            value = interpolatedValuesByColumnIndexAndTime[columnIndex][time];
          }
        }
        data.push(value);
      }
      const outputTableRow: GmTableRow = {
        /* tslint:disable:object-literal-sort-keys */
        geo,
        name: inputTableGeoIdToGeoNameLookup[geo],
        time: Number(time),
        data
        /* tslint:enable:object-literal-sort-keys */
      };
      outputTableRows.push(outputTableRow);
    }
  }

  const outputTable = [inputTableHeaderRow]
    .concat(outputTableRows)
    .map(GmTable.unstructureRow);

  if (page_size) {
    const start = page ? (page - 1) * page_size : 0;
    const end = start + page_size;
    return outputTable.slice(start, end);
  }

  return outputTable;
}
