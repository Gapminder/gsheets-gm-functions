import test, { ExecutionContext, Macro } from "ava";
import { GM_ANNUAL_GROWTH } from "./GM_ANNUAL_GROWTH";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmAnnualGrowth: Macro<any> = (
  t: ExecutionContext,
  {
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_ANNUAL_GROWTH(
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
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
      ["zoo", "Zoo", "1901"]
    ],
    concept_id: "pop",
    time_unit: "year",
    geography: "countries_etc",
    concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 100],
      ["foo", "Foo", 1901, 150],
      ["zoo", "Zoo", 1900, 200],
      ["zoo", "Zoo", 1901, 250]
    ],
    expectedOutput: [["pop"], [undefined], [2.5]]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmAnnualGrowth - " + index, testGmAnnualGrowth, testData);
});
