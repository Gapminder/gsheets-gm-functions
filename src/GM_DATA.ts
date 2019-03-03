import { GM_IMPORT } from "./GM_IMPORT";
import { getDataGeographiesListOfCountriesEtcLookupTable } from "./gsheetsData/dataGeographies";
import { GmTable, GmTableRow } from "./gsheetsData/gmTableStructure";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.
 *
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
 * @param geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param property_or_concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the property or concept data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA(
  column_or_table_range_with_headers: string[][],
  property_or_concept_id: string,
  time_unit: string,
  geography: string,
  property_or_concept_data_table_range_with_headers: string[][]
): any[][] {
  // Ensure expected input range contents
  const inputColumnOrTable = preProcessInputRangeWithHeaders(
    column_or_table_range_with_headers
  );

  if (!geography) {
    geography = "countries_etc";
  }

  // Separate the input range header row
  const inputColumnOrTableHeaderRow = inputColumnOrTable.shift();

  // If input range is a column - assume property lookup - otherwise assume concept lookup
  if (inputColumnOrTableHeaderRow.length === 1) {
    return dataGeographiesListOfCountriesEtcPropertyLookup(
      inputColumnOrTable,
      property_or_concept_id,
      geography,
      property_or_concept_data_table_range_with_headers
    );
  } else {
    if (!time_unit) {
      time_unit = "year";
    }
    return conceptValueLookup(
      inputColumnOrTable,
      property_or_concept_id,
      time_unit,
      geography,
      property_or_concept_data_table_range_with_headers
    );
  }
}

/**
 * @hidden
 */
function dataGeographiesListOfCountriesEtcPropertyLookup(
  inputColumn,
  property,
  geography,
  property_or_concept_data_table_range_with_headers
): any[][] {
  if (geography !== "countries_etc") {
    throw new Error(
      "Lookups of properties using other key concepts than countries_etc is currently not supported"
    );
  }

  const lookupTable = property_or_concept_data_table_range_with_headers
    ? property_or_concept_data_table_range_with_headers
    : getDataGeographiesListOfCountriesEtcLookupTable();

  // Convert the concept_id to the Gsheet-generated equivalent property (eg "UN member since" becomes "unmembersince")
  const gsxProperty = property.toLowerCase().replace(/[^A-Za-z0-9.-]*/g, "");

  const matchedData = inputColumn.map(inputRow => {
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
  inputTable,
  concept_id,
  time_unit,
  geography,
  property_or_concept_data_table_range_with_headers
): any[][] {
  const inputTableRows = inputTable.map(GmTable.structureRow);
  if (!property_or_concept_data_table_range_with_headers) {
    property_or_concept_data_table_range_with_headers = GM_IMPORT(
      concept_id,
      time_unit,
      geography
    );
  }
  const conceptData = preProcessInputRangeWithHeaders(
    property_or_concept_data_table_range_with_headers
  );
  const conceptDataRows = conceptData.map(GmTable.structureRow);
  const conceptDataByGeoAndTime = GmTable.byGeoAndTime(conceptDataRows);
  const matchedData = inputTableRows.map((inputRow: GmTableRow) => {
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
  return [[concept_id]].concat(matchedData);
}
