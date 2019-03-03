import { GM_DATA } from "./GM_DATA";
import { GM_IMPORT } from "./GM_IMPORT";
import { getDataGeographiesListOfCountriesEtcLookupTable } from "./gsheetsData/dataGeographies";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.
 *
 * Note: Uses GM_DATA internally. Performance-related documentation about GM_DATA applies.
 *
 * @param table_range_with_headers A table range including [geo,name,time] to be used for a concept value lookup
 * @param concept_id Concept id (eg. "pop") of which concept to import
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the concept data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_GROWTH(
  table_range_with_headers: string[][],
  concept_id: string,
  time_unit: string,
  geography: string,
  concept_data_table_range_with_headers: string[][]
) {
  const gmDataResult: any[][] = GM_DATA(
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    concept_data_table_range_with_headers
  );
  // Replace GM_DATA property column with the growth over time unit
  const headerRow: string[] = gmDataResult.shift();

  const gmAnnualGrowthDataColumn: number[] = [];
  for (let i = 1; i < gmDataResult.length; i++) {
    gmAnnualGrowthDataColumn[i] =
      parseFloat(gmDataResult[i][0]) / parseFloat(gmDataResult[i - 1][0]);
  }

  const gmAnnualGrowth: any[][] = gmAnnualGrowthDataColumn.map(
    (gmAnnualGrowthDataValue: number) => {
      return [gmAnnualGrowthDataValue];
    }
  );
  gmAnnualGrowth[0] = [undefined];

  return [headerRow].concat(gmAnnualGrowth);
}
