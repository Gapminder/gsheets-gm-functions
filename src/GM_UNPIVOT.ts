import flatten from "lodash/flatten";
import {
  GmTable,
  GmTableRowWithTimesAcrossColumns
} from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Unpivots a standard pivoted Gapminder table [geo, name, ...time-values-across-columns], converting the data column headers into time units and the column values as concept values.
 *
 * @param table_range_with_headers The table range to unpivot
 * @param time_label (Optional with default "time") the header label to use for the time column
 * @param value_label (Optional with default "value") the header label to use for the value column
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_UNPIVOT(
  table_range_with_headers: string[][],
  time_label: string,
  value_label: string
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(table_range_with_headers);
  const inputTableRows: GmTableRowWithTimesAcrossColumns[] = inputTable.map(
    GmTable.structureRowWithTimesAcrossColumns
  );

  // Unpivot
  const headerTableRow = inputTableRows.shift();
  const unpivotedRowsArrays = inputTableRows.map(inputTableRow => {
    return GmTable.unpivotRowWithTimesAcrossColumns(
      inputTableRow,
      headerTableRow
    );
  });
  const unpivotedRows = flatten(unpivotedRowsArrays);

  // Use default header labels if not given any
  if (time_label === undefined) {
    time_label = "time";
  }
  if (value_label === undefined) {
    value_label = "value";
  }

  // Return as string[][]
  return [
    [headerTableRow.geo, headerTableRow.name, time_label, value_label]
  ].concat(unpivotedRows.map(GmTable.unstructureRow));
}
