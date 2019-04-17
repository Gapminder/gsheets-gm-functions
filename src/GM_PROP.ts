import { getDataGeographiesListOfCountriesEtcLookupTable } from "./gsheetsData/dataGeographies";
import { preProcessInputRangeWithHeaders } from "./lib/cleanInputRange";

/**
 * Inserts a property column, including a header row, with a common Gapminder property matched against the input column/table range.
 *
 * @param column_range_with_headers A column range for a property lookup column
 * @param property_id The property (eg. "UN member since") to look up
 * @param property_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the property data to look up against. Can be included for performance reasons.
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PROP(
  column_range_with_headers: string[][],
  property_id: string,
  property_data_table_range_with_headers: string[][]
): any[][] {
  // Ensure expected input range contents
  const inputColumn = preProcessInputRangeWithHeaders(
    column_range_with_headers
  );

  // Separate the input range header row
  const inputColumnWithoutHeaderRow = inputColumn.slice(1);

  return dataGeographiesListOfCountriesEtcPropertyLookup(
    inputColumnWithoutHeaderRow,
    property_id,
    property_data_table_range_with_headers
  );
}

/**
 * @hidden
 */
function dataGeographiesListOfCountriesEtcPropertyLookup(
  inputColumnWithoutHeaderRow,
  property,
  property_data_table_range_with_headers
): any[][] {
  const lookupTable = property_data_table_range_with_headers
    ? property_data_table_range_with_headers
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
