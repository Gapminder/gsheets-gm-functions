import test, { ExecutionContext, Macro } from "ava";
import { GM_WEIGHTED_AVERAGE } from "./GM_WEIGHTED_AVERAGE";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
(global as any).UrlFetchApp = MinimalUrlFetchApp;

/**
 * @hidden
 */
const testGmWeightedAverage: Macro<any> = (
  t: ExecutionContext,
  {
    input_table_range_with_headers,
    aggregation_property_id,
    population_concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_WEIGHTED_AVERAGE(
    input_table_range_with_headers,
    aggregation_property_id,
    population_concept_data_table_range_with_headers
  );
  // t.log({ input_table_range_with_headers });
  // t.log({ output });
  // t.log({ expectedOutput });
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    input_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "foo"],
      ["foo", "Foo", "1900", "10000"],
      ["zoo", "Zoo", "1901", "12500"]
    ],
    aggregation_property_id: "four_regions",
    population_concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 100],
      ["foo", "Foo", 1901, 150],
      ["zoo", "Zoo", 1900, 200],
      ["zoo", "Zoo", 1901, 250]
    ],
    expectedOutput: [
      ["four_regions", "name", "year", "foo"],
      ["Unknown geo: foo", "Unknown alias: Unknown geo: foo", "1900", 10000],
      ["Unknown geo: zoo", "Unknown alias: Unknown geo: zoo", "1901", 12500]
    ]
  },
  {
    input_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "foo"],
      ["foo", "Foo", "1900", "10000"],
      ["zoo", "Zoo", "1901", "12500"]
    ],
    aggregation_property_id: "four_regions",
    population_concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["foo", "Foo", 1900, 100],
      ["foo", "Foo", 1901, 150]
    ],
    expectedOutput: [
      ["four_regions", "name", "year", "foo"],
      ["Unknown geo: foo", "Unknown alias: Unknown geo: foo", "1900", 10000],
      ["Unknown geo: zoo", "Unknown alias: Unknown geo: zoo", "1901", NaN]
    ]
  },
  {
    input_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "Literacy rate", "School enrollment"],
      ["alb", "Albania", "2006", "34", "12"],
      ["alb", "Albania", "2007", "36", "13"],
      ["and", "Andorra", "2006", "98", "55"],
      ["and", "Andorra", "2007", "99", "54"],
      ["dza", "Algeria", "2006", "87", "76"],
      ["dza", "Algeria", "2007", "88", "75"],
      ["ago", "Angola", "2006", "34", "11"],
      ["ago", "Angola", "2007", "35", "12"]
    ],
    aggregation_property_id: "four_regions",
    population_concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "population"],
      ["alb", "Albania", 2006, 3054331],
      ["alb", "Albania", 2007, 3023907],
      ["and", "Andorra", 2006, 5533],
      ["and", "Andorra", 2007, 5535],
      ["dza", "Algeria", 2006, 34300076],
      ["dza", "Algeria", 2007, 20262399],
      ["ago", "Angola", 2006, 423423],
      ["ago", "Angola", 2007, 423435]
    ],
    expectedOutput: [
      ["four_regions", "name", "year", "Literacy rate", "School enrollment"],
      ["africa", "Africa", "2006", 86.35371089762585, 75.20738128954112],
      ["africa", "Africa", "2007", 86.91510030487531, 73.7104022491914],
      ["europe", "Europe", "2006", 34.11572801928452, 12.077754762956785],
      ["europe", "Europe", "2007", 36.11510535603586, 13.074909834880483]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmWeightedAverage - " + index, testGmWeightedAverage, testData);
});
