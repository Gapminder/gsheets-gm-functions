import test, { ExecutionContext, Macro } from "ava";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";

/**
 * @hidden
 */
const testLinearInterpolation: Macro<any> = (
  t: ExecutionContext,
  { table_range_with_headers, method, expectedOutput }
) => {
  const output = GM_INTERPOLATE(table_range_with_headers, method);
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    table_range_with_headers: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", "1900", "0", "100"]
    ],
    method: "linear",
    expectedOutput: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", 1900, 0, 100]
    ]
  },
  {
    table_range_with_headers: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", "1900", "0", "100"],
      ["foo", "Foo", "1905", "0", "105"]
    ],
    method: "linear",
    expectedOutput: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", 1900, 0, 100],
      ["foo", "Foo", 1901, 0, 101],
      ["foo", "Foo", 1902, 0, 102],
      ["foo", "Foo", 1903, 0, 103],
      ["foo", "Foo", 1904, 0, 104],
      ["foo", "Foo", 1905, 0, 105]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testLinearInterpolation - " + index, testLinearInterpolation, testData);
});
