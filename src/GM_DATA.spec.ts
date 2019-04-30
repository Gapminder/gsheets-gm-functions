import test, { ExecutionContext, Macro } from "ava";
import { GM_DATA } from "./GM_DATA";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmData: Macro<any> = (
  t: ExecutionContext,
  {
    input_table_range_with_headers,
    concepts_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_DATA(
    input_table_range_with_headers,
    concepts_data_table_range_with_headers
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
      ["zoo", "Zoo", "1901"]
    ],
    concepts_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 100],
      ["foo", "Foo", 1901, 150],
      ["zoo", "Zoo", 1900, 200],
      ["zoo", "Zoo", 1901, 250]
    ],
    expectedOutput: [["population"], [100], [250]]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmData - " + index, testGmData, testData);
});
