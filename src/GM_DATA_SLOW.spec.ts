import test, { ExecutionContext, Macro } from "ava";
import { GM_DATA_SLOW } from "./GM_DATA_SLOW";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmDataSlow: Macro<any> = (
  t: ExecutionContext,
  {
    input_table_range_with_headers,
    concept_id,
    time_unit,
    geo_set,
    expectedOutput
  }
) => {
  const output = GM_DATA_SLOW(
    input_table_range_with_headers,
    concept_id,
    time_unit,
    geo_set
  );
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    input_table_range_with_headers: [
      ["geo_id", "geo_name", "year"],
      ["foo", "Foo", "1900"],
      ["zoo", "Zoo", "1901"],
      ["swe", "Sweden", "1950"]
    ],
    concept_id: "pop_gm_6",
    time_unit: "year",
    geo_set: "countries_etc",
    expectedOutput: [
      ["pop_gm_6"],
      ["Unknown geo: foo"],
      ["Unknown geo: zoo"],
      ["7011275"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmDataSlow - " + index, testGmDataSlow, testData);
});
