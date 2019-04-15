import test, { ExecutionContext, Macro } from "ava";
import { GM_GROWTH } from "./GM_GROWTH";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmGrowth: Macro<any> = (
  t: ExecutionContext,
  {
    table_range_with_headers,
    concept_id,
    time_unit,
    geo_set,
    concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_GROWTH(
    table_range_with_headers,
    concept_id,
    time_unit,
    geo_set,
    concept_data_table_range_with_headers
  );
  // t.log({ output, expectedOutput });
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    table_range_with_headers: [
      ["geo_id", "geo_name", "year"],
      ["foo", "Foo", "1900"],
      ["foo", "Foo", "1901"],
      ["foo", "Foo", "1902"],
      ["bar", "Bar", "1900"],
      ["bar", "Bar", "1901"],
      ["bar", "Bar", "1902"]
    ],
    concept_id: "pop",
    time_unit: "year",
    geo_set: "countries_etc",
    concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 100],
      ["foo", "Foo", 1901, 150],
      ["foo", "Foo", 1902, 200],
      ["bar", "Bar", 1900, 250],
      ["bar", "Bar", 1901, 200],
      ["bar", "Bar", 1902, 210]
    ],
    expectedOutput: [
      ["pop"],
      [undefined],
      [0.5],
      [0.33333333333333326],
      [undefined],
      [-0.19999999999999996],
      [0.050000000000000044]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmGrowth - " + index, testGmGrowth, testData);
});
