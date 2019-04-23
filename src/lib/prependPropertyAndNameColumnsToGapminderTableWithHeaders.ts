import { GM_NAME } from "../GM_NAME";
import { GM_PROP } from "../GM_PROP";
import { gapminderPropertyToGeoSetMap } from "../gsheetsData/hardcodedConstants";

/**
 * @hidden
 */
export function prependPropertyAndNameColumnsToGapminderTableWithHeaders(
  inputTable,
  aggregation_property_id
) {
  const geoColumnWithHeaderRow = inputTable.map(row => [row[0]]);
  const aggregationPropertyColumnWithHeaderRow = GM_PROP(
    geoColumnWithHeaderRow,
    aggregation_property_id
  );
  const aggregationGeoSet =
    gapminderPropertyToGeoSetMap[aggregation_property_id];
  const aggregationPropertyNameColumnWithHeaderRow = aggregationGeoSet
    ? GM_NAME(aggregationPropertyColumnWithHeaderRow, aggregationGeoSet, true)
    : aggregationPropertyColumnWithHeaderRow;
  return inputTable.map((row, index) => {
    if (aggregationPropertyColumnWithHeaderRow[index] === undefined) {
      throw new Error(
        `The aggregationPropertyColumnWithHeaderRow at index ${index} is undefined`
      );
    }
    if (aggregationPropertyNameColumnWithHeaderRow[index] === undefined) {
      throw new Error(
        `The aggregationPropertyNameColumnWithHeaderRow at index ${index} is undefined`
      );
    }
    return [
      aggregationPropertyColumnWithHeaderRow[index][0],
      aggregationPropertyNameColumnWithHeaderRow[index][0],
      ...row
    ];
  });
}
