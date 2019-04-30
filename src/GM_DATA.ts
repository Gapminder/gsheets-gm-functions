import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a concept column, including a header row, with a common Gapminder concept matched against the input column/table range.
 *
 * Note: Requires that the concept data to match against is first imported using the "Gapminder Data -> Import/refresh data dependencies".
 *
 * @param input_table_range_with_headers The input table range including [geo,name,time] for a concept value lookup
 * @param concepts_data_table_range_with_headers Local spreadsheet range (imported using data-dependencies) of the concepts' data to look up against. Required for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA(
  input_table_range_with_headers: string[][],
  concepts_data_table_range_with_headers: string[][]
): any[][] {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );

  const inputTableWithoutHeaderRow = inputTable.slice(1);
  const matchedData = conceptValueLookup(
    inputTableWithoutHeaderRow,
    concepts_data_table_range_with_headers
  );

  const conceptDataTableHeaders = concepts_data_table_range_with_headers[0];
  const conceptDataHeader = conceptDataTableHeaders[3];

  return [[conceptDataHeader]].concat(matchedData);
}

/**
 * @hidden
 */
function conceptValueLookup(
  inputTableWithoutHeaderRow,
  concepts_data_table_range_with_headers
): any[][] {
  const inputTableRowsWithoutHeaderRow = inputTableWithoutHeaderRow.map(
    GmTable.structureRow
  );
  const conceptData = preProcessInputRangeWithHeaders(
    concepts_data_table_range_with_headers
  );
  if (conceptData.length === 0) {
    throw new Error("No property or concept data supplied");
  }
  const conceptDataRows = conceptData.map(GmTable.structureRow);
  const conceptDataByGeoAndTime = GmTable.byGeoAndTime(conceptDataRows);
  return inputTableRowsWithoutHeaderRow.map((inputRow: GmTableRow) => {
    const geo = inputRow.geo;
    if (conceptDataByGeoAndTime[geo] === undefined) {
      return [`Unknown geo: ${geo}`];
    }
    const time = inputRow.time;
    if (conceptDataByGeoAndTime[geo][time] === undefined) {
      return [`Missing time entry: ${time}`];
    }
    return conceptDataByGeoAndTime[geo][time].data;
  });
}
