import { GM_DATA } from "./GM_DATA";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Divides the concept-value column(s) of the input table range by the population of the geo_set.
 *
 * Note: Uses GM_DATA internally
 *
 * @param input_table_range_with_headers_and_concept_values A table range including [geo,name,time,concept-values...]
 * @param population_concept_data_table_range_with_headers Local spreadsheet range (imported using data-dependencies) of the population concept data to look up against, where the population concept is the first concept column in the data range. Required for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PER_CAP(
  input_table_range_with_headers_and_concept_values: string[][],
  population_concept_data_table_range_with_headers: string[][]
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers_and_concept_values
  );

  const inputTableRows = inputTable.map(GmTable.structureRow);
  const inputTableHeaderRow = inputTableRows.slice().shift();
  const inputTableRowsWithoutHeaderRow = inputTableRows.slice(1);
  // Population data
  const populationGmDataResult: any[][] = GM_DATA(
    input_table_range_with_headers_and_concept_values,
    population_concept_data_table_range_with_headers
  );
  populationGmDataResult.shift();

  const conceptDataRows = inputTableRowsWithoutHeaderRow.map(
    (inputTableRow: GmTableRow) => inputTableRow.data
  );
  const conceptDataPerCapRows: any[][] = conceptDataRows.map(
    (conceptDataRow, rowIndex) => {
      return conceptDataRow.map(conceptDataValue => {
        return (
          parseFloat(conceptDataValue) /
          parseFloat(populationGmDataResult[rowIndex][0])
        );
      });
    }
  );

  const conceptDataPerCapHeaderRow = inputTableHeaderRow.data.map(
    conceptHeader => {
      return [conceptHeader + " per capita"];
    }
  );
  return conceptDataPerCapHeaderRow.concat(conceptDataPerCapRows);
}
