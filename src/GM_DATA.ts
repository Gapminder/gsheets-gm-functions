import { preProcessInputRangeWithHeaders } from "./cleanInputRange";
import { getDataGeographiesListOfCountriesEtcLookupTable } from "./dataGeographies";

/**
 * Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.
 *
 * @param column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param prop_or_concept_id
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA(
  column_or_table_range_with_headers: string[][],
  prop_or_concept_id: string
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
      prop_or_concept_id
    );
  } else {
    return conceptValueLookup(inputColumnOrTable, prop_or_concept_id);
  }
}

/**
 * @hidden
 */
function dataGeographiesListOfCountriesEtcPropertyLookup(inputColumn, prop) {
  const lookupTable = getDataGeographiesListOfCountriesEtcLookupTable();

  // Convert the prop to the Gsheet-generated equivalent property (eg "UN member since" becomes "unmembersince")
  const gsxProperty = prop.toLowerCase().replace(/[^A-Za-z0-9]*/g, "");

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

  return [[prop]].concat(matchedData);
}

/**
 * @hidden
 */
function conceptValueLookup(inputTable, conceptId) {
  return [["foo"]];
}
