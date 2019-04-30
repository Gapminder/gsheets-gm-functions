import { GM_IMPORT_SLOW } from "./GM_IMPORT_SLOW";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.
 *
 * Imports the corresponding data on-the-fly. Note that using GM_DATA is the only performant way to join concept data in a spreadsheet.
 *
 * Takes 10-20 seconds:
 * =GM_DATA_SLOW(B7:D, "pop", "year", "countries_etc")
 *
 * Takes 2-4 seconds:
 * =GM_DATA(B7:D, 'data:pop@fasttrack:year:countries_etc'!A1:D)
 *
 * @param column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param concept_id The concept id ("pop") of which value to look up
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA_SLOW(
  column_or_table_range_with_headers: string[][],
  concept_id: string,
  time_unit: string,
  geo_set: string
): any[][] {
  // Ensure expected input range contents
  const inputColumnOrTable = preProcessInputRangeWithHeaders(
    column_or_table_range_with_headers
  );

  // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
  const validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(geo_set);

  // Separate the input range header row
  const inputColumnOrTableHeaderRow = inputColumnOrTable.shift();
  const inputColumnOrTableWithoutHeaderRow = inputColumnOrTable;

  return conceptValueLookup(
    inputColumnOrTableWithoutHeaderRow,
    concept_id,
    time_unit,
    validatedGeoSetArgument,
    undefined
  );
}

/**
 * @hidden
 */
function conceptValueLookup(
  inputTableWithoutHeaderRow,
  concept_id,
  time_unit,
  geo_set,
  property_or_concepts_data_table_range_with_headers
): any[][] {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  if (!time_unit) {
    time_unit = "year";
  }
  const inputTableRowsWithoutHeaderRow = inputTableWithoutHeaderRow.map(
    GmTable.structureRow
  );
  if (!property_or_concepts_data_table_range_with_headers) {
    property_or_concepts_data_table_range_with_headers = GM_IMPORT_SLOW(
      concept_id,
      time_unit,
      geo_set
    );
  }
  const conceptData = preProcessInputRangeWithHeaders(
    property_or_concepts_data_table_range_with_headers
  );
  const conceptDataRows = conceptData.map(GmTable.structureRow);
  const conceptDataByGeoAndTime = GmTable.byGeoAndTime(conceptDataRows);
  const matchedData = inputTableRowsWithoutHeaderRow.map(
    (inputRow: GmTableRow) => {
      const geo = inputRow.geo;
      if (conceptDataByGeoAndTime[geo] === undefined) {
        return [`Unknown geo: ${geo}`];
      }
      const time = inputRow.time;
      if (conceptDataByGeoAndTime[geo][time] === undefined) {
        return [`Missing time entry: ${time}`];
      }
      return conceptDataByGeoAndTime[geo][time].data;
    }
  );
  return [[concept_id]].concat(matchedData);
}
