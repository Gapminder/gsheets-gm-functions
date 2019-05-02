import test, { ExecutionContext, Macro } from "ava";
import { GM_DATA_AGGR } from "./GM_DATA_AGGR";

/**
 * @hidden
 */
const testGmDataAggr: Macro<any> = (
  t: ExecutionContext,
  {
    input_table_range_with_headers,
    concept_data_table_range_with_headers,
    expectedOutput
  }
) => {
  const output = GM_DATA_AGGR(
    input_table_range_with_headers,
    concept_data_table_range_with_headers
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
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", "1900", "0", "100"],
      ["foo", "Foo", "1901", "15", "900"],
      ["zoo", "Zoo", "1900", "22", "200"],
      ["zoo", "Zoo", "1901", "44", "500"]
    ],
    concept_data_table_range_with_headers: [
      ["geo_id", "geo_name", "year", "time-dependent category"],
      ["foo", "Foo", 1900, "A"],
      ["foo", "Foo", 1901, "B"],
      ["zoo", "Zoo", 1900, "A"],
      ["zoo", "Zoo", 1901, "A"]
    ],
    expectedOutput: [
      [
        "time-dependent category",
        "time-dependent category",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["A", "A", "1900", 22, 300],
      ["A", "A", "1901", 44, 500],
      ["B", "B", "1901", 15, 900]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmDataAggr - " + index, testGmDataAggr, testData);
});
