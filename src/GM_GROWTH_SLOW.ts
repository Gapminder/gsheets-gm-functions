import { GM_DATA_SLOW } from "./GM_DATA_SLOW";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.
 *
 * Note: Uses GM_DATA_SLOW internally. Performance-related documentation about GM_DATA_SLOW applies.
 *
 * @param input_table_range_with_headers A table range including [geo,name,time] to be used for a concept value lookup
 * @param concept_id The concept id ("pop_gm_6") of which value to look up
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_GROWTH_SLOW(
  input_table_range_with_headers: string[][],
  concept_id: string,
  time_unit: string,
  geo_set: string
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
  // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
  const validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(geo_set);
  // Concept data
  const gmDataResult: any[][] = GM_DATA_SLOW(
    input_table_range_with_headers,
    concept_id,
    time_unit,
    validatedGeoSetArgument
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
