import { preProcessInputRangeWithHeaders } from "./cleanInputRange";
import { getDataGeographiesListOfCountriesEtcLookupTable } from "./dataGeographies";

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.
 *
 * @param column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param property_or_concept_id Either the property (eg. "UN member since") or concept id (eg. "pop") of which value to look up
 * @param geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA(
  column_or_table_range_with_headers: string[][],
  property_or_concept_id: string,
  geography: string
) {
  // Ensure expected input range contents
  const inputColumnOrTable = preProcessInputRangeWithHeaders(
    column_or_table_range_with_headers
  );

  // Separate the input range header row
  const inputColumnOrTableHeaderRow = inputColumnOrTable.shift();

  if (inputColumnOrTableHeaderRow.length === 1) {
    return dataGeographiesListOfCountriesEtcPropertyLookup(
      inputColumnOrTable,
      property_or_concept_id,
      geography
    );
  } else {
    return conceptValueLookup(
      inputColumnOrTable,
      property_or_concept_id,
      geography
    );
  }
}

/**
 * @hidden
 */
function dataGeographiesListOfCountriesEtcPropertyLookup(
  inputColumn,
  value_property,
  geography
) {
  if (!geography) {
    geography = "countries_etc";
  }
  if (geography !== "countries_etc") {
    throw new Error(
      "Lookups of properties using other key concepts than countries_etc is currently not supported"
    );
  }

  const lookupTable = getDataGeographiesListOfCountriesEtcLookupTable();

  // Convert the concept_id to the Gsheet-generated equivalent property (eg "UN member since" becomes "unmembersince")
  const gsxProperty = value_property
    .toLowerCase()
    .replace(/[^A-Za-z0-9.-]*/g, "");

  const matchedData = inputColumn.map(inputRow => {
    const geo = inputRow[0];
    const result = lookupTable[geo];
    return [
      result
        ? result[gsxProperty]
          ? result[gsxProperty]
          : `Unknown property ${gsxProperty}`
        : `Unknown geo: ${geo}`
    ];
  });

  return [[value_property]].concat(matchedData);
}

/**
 * @hidden
 */
function conceptValueLookup(inputTable, concept_id, geography) {
  return [["foo"]];
}
