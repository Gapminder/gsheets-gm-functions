import test, { ExecutionContext, Macro } from "ava";
import { GM_PROP } from "./GM_PROP";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmProp: Macro<any> = (
  t: ExecutionContext,
  {
    column_range_with_headers,
    property_id,
    property_or_concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_PROP(
    column_range_with_headers,
    property_id,
    property_or_concept_data_table_range_with_headers
  );
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    column_range_with_headers: [["geo"], ["foo"], ["swe"]],
    property_id: "UN member since",
    geo_set: "countries_etc",
    expectedOutput: [["UN member since"], ["Unknown geo: foo"], ["19/11/1946"]]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmProp - " + index, testGmProp, testData);
});
