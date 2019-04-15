import { GM_DATA } from "./GM_DATA";
import { GM_IMPORT } from "./GM_IMPORT";
import { getDataGeographiesListOfCountriesEtcLookupTable } from "./gsheetsData/dataGeographies";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Divides the concept-value column(s) of the input table range by the population of the geo_set.
 *
 * Note: Uses GM_DATA internally. Performance-related documentation about GM_DATA applies.
 *
 * @param table_range_with_headers_and_concept_values A table range including [geo,name,time,concept-values...]
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @param population_concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the population concept data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PER_CAP(
  table_range_with_headers_and_concept_values: string[][],
  time_unit: string,
  geo_set: string,
  population_concept_data_table_range_with_headers: string[][]
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    table_range_with_headers_and_concept_values
  );
  const inputTableRows = inputTable.map(GmTable.structureRow);
  const inputTableHeaderRow = inputTableRows.slice().shift();
  const inputTableRowsWithoutHeaderRow = inputTableRows.slice(1);
  // Population data
  const populationGmDataResult: any[][] = GM_DATA(
    table_range_with_headers_and_concept_values,
    "pop",
    time_unit,
    geo_set,
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
