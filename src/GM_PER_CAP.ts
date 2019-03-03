import { GM_DATA } from "./GM_DATA";
import { GM_IMPORT } from "./GM_IMPORT";
import { getDataGeographiesListOfCountriesEtcLookupTable } from "./gsheetsData/dataGeographies";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range and divided by the population of the geography.
 *
 * Note: Uses GM_DATA internally. Performance-related documentation about GM_DATA applies.
 *
 * @param table_range_with_headers A table range including [geo,name,time] to be used for a concept value lookup
 * @param concept_id Concept id (eg. "pop") of which concept to import
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the concept data to look up against. Can be included for performance reasons.
 * @param population_concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the population concept data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PER_CAP(
  table_range_with_headers: string[][],
  concept_id: string,
  time_unit: string,
  geography: string,
  concept_data_table_range_with_headers: string[][],
  population_concept_data_table_range_with_headers: string[][]
) {
  const conceptGmDataResult: any[][] = GM_DATA(
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    concept_data_table_range_with_headers
  );
  const populationGmDataResult: any[][] = GM_DATA(
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    population_concept_data_table_range_with_headers
  );
  const headerRow: string[] = conceptGmDataResult.shift();
  populationGmDataResult.shift();
  console.log({ headerRow, conceptGmDataResult });

  const gmPerCapDataColumn: number[] = [];
  for (let i = 0; i < conceptGmDataResult.length; i++) {
    gmPerCapDataColumn[i] =
      parseFloat(conceptGmDataResult[i][0]) /
      parseFloat(populationGmDataResult[i][0]);
  }

  const gmPerCap: any[][] = gmPerCapDataColumn.map(
    (gmPerCapDataValue: number) => {
      return [gmPerCapDataValue];
    }
  );

  return [[headerRow[0] + " per capita"]].concat(gmPerCap);
}
