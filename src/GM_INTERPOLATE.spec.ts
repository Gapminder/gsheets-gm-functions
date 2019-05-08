import test, { ExecutionContext, Macro } from "ava";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";

/**
 * @hidden
 */
const testInterpolation: Macro<any> = (
  t: ExecutionContext,
  { input_table_range_with_headers, method, expectedOutput }
) => {
  const output = GM_INTERPOLATE(input_table_range_with_headers, method);
  // t.log({output, expectedOutput});
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
    input_table_range_with_headers: [
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
  },
  {
    input_table_range_with_headers: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", "1900", "0", "100"]
    ],
    method: "growth",
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
    input_table_range_with_headers: [
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
    method: "growth",
    expectedOutput: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", 1900, 0, 100],
      ["foo", "Foo", 1901, NaN, 100.98057977],
      ["foo", "Foo", 1902, NaN, 101.9707749],
      ["foo", "Foo", 1903, NaN, 102.97067969],
      ["foo", "Foo", 1904, NaN, 103.98038934],
      ["foo", "Foo", 1905, 0, 105]
    ]
  },
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
      ["foo", "Foo", "1905", "0", "105"]
    ],
    method: "zerofill",
    expectedOutput: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", 1900, 0, 100],
      ["foo", "Foo", 1901, 0, 0],
      ["foo", "Foo", 1902, 0, 0],
      ["foo", "Foo", 1903, 0, 0],
      ["foo", "Foo", 1904, 0, 0],
      ["foo", "Foo", 1905, 0, 105]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testInterpolation - " + index, testInterpolation, testData);
});
