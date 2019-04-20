import { getGeoAliasesAndSynonymsLookupTable } from "./gsheetsData/geoAliasesAndSynonyms";
import { GmTable } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Aggregates an input table by a time-independent property and time, returning a table with the population-weighted average values of the input table.
 *
 * The input table must be at least four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * @param input_table_range_with_headers
 * @param aggregation_property_id Aggregation property
 * @param population_concept_data_table_range_with_headers Local spreadsheet range of the population concept data to look up against. Required for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_WEIGHTED_AVERAGE(
  input_table_range_with_headers: string[][],
  aggregation_property_id: string,
  population_concept_data_table_range_with_headers: string
) {
  // Ensure expected input range contents
  const inputTable = preProcessInputRangeWithHeaders(
    input_table_range_with_headers
  );

  const inputTableRows = inputTable.map(GmTable.structureRow);
  const inputTableHeaderRow = inputTableRows.slice(0, 1).shift();
  const inputTableRowsWithoutHeaderRow = inputTableRows.slice(1);

  // TODO
}
