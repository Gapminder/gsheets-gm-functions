import { GM_IMPORT } from "./GM_IMPORT";
import { getDataGeographiesListOfCountriesEtcLookupTable } from "./gsheetsData/dataGeographies";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.
 *
 * Note that using a range from a locally imported data dependency is the only performant way to join concept data in a spreadsheet.
 *
 * Takes 10-20 seconds:
 * =GM_DATA(B7:D, "pop")
 *
 * Takes 2-4 seconds:
 * =GM_DATA(B7:D, "pop", "year", "countries_etc", 'data:pop:year:countries_etc'!A1:D)
 *
 * @param column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param property_or_concept_id Either the property (eg. "UN member since") or concept id (eg. "pop") of which value to look up
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @param property_or_concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the property or concept data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA(
  column_or_table_range_with_headers: string[][],
  property_or_concept_id: string,
  time_unit: string,
  geo_set: string,
  property_or_concept_data_table_range_with_headers: string[][]
): any[][] {
  // Ensure expected input range contents
  const inputColumnOrTable = preProcessInputRangeWithHeaders(
    column_or_table_range_with_headers
  );

  // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
  validateAndAliasTheGeoSetArgument(geo_set);

  // Separate the input range header row
  const inputColumnOrTableHeaderRow = inputColumnOrTable.shift();
  const inputColumnOrTableWithoutHeaderRow = inputColumnOrTable;

  // If input range is a column - assume property lookup - otherwise assume concept lookup
  if (inputColumnOrTableHeaderRow.length === 1) {
    return dataGeographiesListOfCountriesEtcPropertyLookup(
      inputColumnOrTableWithoutHeaderRow,
      property_or_concept_id,
      geo_set,
      property_or_concept_data_table_range_with_headers
    );
  } else {
    return conceptValueLookup(
      inputColumnOrTableWithoutHeaderRow,
      property_or_concept_id,
      time_unit,
      geo_set,
      property_or_concept_data_table_range_with_headers
    );
  }
}

/**
 * @hidden
 */
function dataGeographiesListOfCountriesEtcPropertyLookup(
  inputColumnWithoutHeaderRow,
  property,
  geo_set,
  property_or_concept_data_table_range_with_headers
): any[][] {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  if (geo_set !== "countries_etc") {
    throw new Error(
      "Lookups of properties using other key concepts than countries_etc is currently not supported"
    );
  }

  const lookupTable = property_or_concept_data_table_range_with_headers
    ? property_or_concept_data_table_range_with_headers
    : getDataGeographiesListOfCountriesEtcLookupTable();

  // Convert the concept_id to the Gsheet-generated equivalent property (eg "UN member since" becomes "unmembersince")
  const gsxProperty = property.toLowerCase().replace(/[^A-Za-z0-9.-]*/g, "");

  const matchedData = inputColumnWithoutHeaderRow.map(inputRow => {
    const geo = inputRow[0];
    if (lookupTable[geo] === undefined) {
      return [`Unknown geo: ${geo}`];
    }
    const result = lookupTable[geo];
    if (result[gsxProperty] === undefined) {
      return [`Unknown property ${gsxProperty}`];
    }
    return [result[gsxProperty]];
  });

  return [[property]].concat(matchedData);
}

/**
 * @hidden
 */
function conceptValueLookup(
  inputTableWithoutHeaderRow,
  concept_id,
  time_unit,
  geo_set,
  property_or_concept_data_table_range_with_headers
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
  if (!property_or_concept_data_table_range_with_headers) {
    property_or_concept_data_table_range_with_headers = GM_IMPORT(
      concept_id,
      time_unit,
      geo_set
    );
  }
  const conceptData = preProcessInputRangeWithHeaders(
    property_or_concept_data_table_range_with_headers
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
