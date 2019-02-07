import test, { ExecutionContext, Macro } from "ava";
import { GM_DATA } from "./GM_DATA";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmDataPropertyLookup: Macro<any> = (
  t: ExecutionContext,
  {
    column_range_with_headers,
    value_property,
    geography,
    time_unit,
    property_or_concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_DATA(
    column_range_with_headers,
    value_property,
    time_unit,
    geography,
    property_or_concept_data_table_range_with_headers
  );
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
  {
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    property_or_concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_DATA(
    table_range_with_headers,
    concept_id,
    time_unit,
    geography,
    property_or_concept_data_table_range_with_headers
  );
  // t.log({output, expectedOutput});
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
    time_unti: "year",
    geography: "countries_etc",
    property_or_concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 100],
      ["foo", "Foo", 1901, 150],
      ["zoo", "Zoo", 1900, 200],
      ["zoo", "Zoo", 1901, 250]
    ],
    expectedOutput: [["pop"], [100], [250]]
  },
  {
    table_range_with_headers: [
      ["geo_id", "geo_name", "year"],
      ["foo", "Foo", "1900"],
      ["zoo", "Zoo", "1901"],
      ["swe", "Sweden", "1950"]
    ],
    concept_id: "pop",
    time_unti: "year",
    geography: "countries_etc",
    property_or_concept_data_table_range_with_headers: undefined,
    expectedOutput: [
      ["pop"],
      ["Unknown geo: foo"],
      ["Unknown geo: zoo"],
      ["7009912"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmDataConceptLookup - " + index, testGmDataConceptLookup, testData);
});
