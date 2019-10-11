import { GM_DATA_SLOW } from "./GM_DATA_SLOW";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Divides the concept-value column(s) of the input table range by the population of the geo_set.
 *
 * Note: Uses GM_DATA_SLOW internally. Performance-related documentation about GM_DATA_SLOW applies.
 *
 * @param input_table_range_with_headers_and_concept_values A table range including [geo,name,time,concept-values...]
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PER_CAP_SLOW(
  input_table_range_with_headers_and_concept_values: string[][],
  time_unit: string,
  geo_set: string
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers_and_concept_values
  );

  // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
  const validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(geo_set);

  const inputTableRows = inputTable.map(GmTable.structureRow);
  const inputTableHeaderRow = inputTableRows.slice().shift();
  const inputTableRowsWithoutHeaderRow = inputTableRows.slice(1);
  // Population data
  const populationGmDataResult: any[][] = GM_DATA_SLOW(
    input_table_range_with_headers_and_concept_values,
    "pop_gm_6",
    time_unit,
    geo_set
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
