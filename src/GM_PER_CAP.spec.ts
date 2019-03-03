import test, { ExecutionContext, Macro } from "ava";
import { GM_PER_CAP } from "./GM_PER_CAP";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmPerCap: Macro<any> = (
  t: ExecutionContext,
  {
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    concept_data_table_range_with_headers,
    population_concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_PER_CAP(
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    concept_data_table_range_with_headers,
    population_concept_data_table_range_with_headers
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
    concept_id: "foo",
    time_unit: "year",
    geography: "countries_etc",
    concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 10000],
      ["foo", "Foo", 1901, 15000],
      ["zoo", "Zoo", 1900, 20000],
      ["zoo", "Zoo", 1901, 25000]
    ],
    population_concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 100],
      ["foo", "Foo", 1901, 150],
      ["zoo", "Zoo", 1900, 200],
      ["zoo", "Zoo", 1901, 250]
    ],
    expectedOutput: [["foo per capita"], [100], [100]]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmPerCap - " + index, testGmPerCap, testData);
});
