import flatten from "lodash/flatten";
import {
  GmTable,
  GmTableRowWithTimesAcrossColumns
} from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Unpivots a standard pivoted Gapminder table [geo, name, ...time-values-across-columns], converting the data column headers into time units and the column values as concept values.
 *
 * @param input_table_range_with_headers The table range to unpivot
 * @param time_label (Optional with default "time") the header label to use for the time column
 * @param value_label (Optional with default "value") the header label to use for the value column
 * @param page_size Optional. Used to paginate large output tables
 * @param page Optional. Used to paginate large output tables
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_UNPIVOT(
  input_table_range_with_headers: string[][],
  time_label: string,
  value_label: string,
  page_size: number,
  page: number
) {
  if (!page_size) {
    page_size = null;
  }
  if (!page) {
    page = null;
  }

  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );
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
  const outputTable = [
    [headerTableRow.geo, headerTableRow.name, time_label, value_label]
  ].concat(unpivotedRows.map(GmTable.unstructureRow));

  if (page_size) {
    const start = page ? (page - 1) * page_size : 0;
    const end = start + page_size;
    return outputTable.slice(start, end);
  }

  return outputTable;
}
