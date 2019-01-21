import { getDataGeographiesListOfCountriesEtcLookupTable } from "./dataGeographies";

/**
 * Inserts a property column, including a header row, with a common Gapminder property matched against the input column range.
 *
 * @param column_range_with_headers
 * @param prop
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_PROP(column_range_with_headers: string[][], prop: string) {
  const lookupTable = getDataGeographiesListOfCountriesEtcLookupTable();

  // Clone the input param to prevent side effects
  const inputColumn = column_range_with_headers.concat([]);

  // Drop the input range header row
  inputColumn.shift();

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
