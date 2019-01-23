import test, { ExecutionContext, Macro } from "ava";
import { GM_DATA } from "./GM_DATA";
import { MinimalUrlFetchApp } from "./MinimalUrlFetchApp";
(global as any).UrlFetchApp = MinimalUrlFetchApp;

/**
 * @hidden
 */
const testGmDataPropertyLookup: Macro<any> = (
  t: ExecutionContext,
  { column_range_with_headers, value_property, geography, expectedOutput }
) => {
  const output = GM_DATA(column_range_with_headers, value_property, geography);
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    column_range_with_headers: [["geo"], ["foo"], ["swe"]],
    value_property: "UN member since",
    geography: "countries_etc",
    expectedOutput: [["UN member since"], ["Unknown geo: foo"], ["19/11/1946"]]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testGmDataPropertyLookup - " + index,
    testGmDataPropertyLookup,
    testData
  );
});

/**
 * @hidden
 */
const testGmDataConceptLookup: Macro<any> = (
  t: ExecutionContext,
  { table_range_with_headers, concept_id, geography, expectedOutput }
) => {
  const output = GM_DATA(table_range_with_headers, concept_id, geography);
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    table_range_with_headers: [
      ["geo_id", "geo_name", "year"],
      ["foo", "Foo", "1900"]
    ],
    concept_id: "pop",
    geography: "countries_etc",
    expectedOutput: [["foo"]]
    /*[
      ["geo_id", "geo_name", "year", "Overall score"],
      ["foo", "Foo", 1900, 0, 100]
    ]*/
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmDataConceptLookup - " + index, testGmDataConceptLookup, testData);
});
