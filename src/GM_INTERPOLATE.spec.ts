import test, { ExecutionContext, Macro } from "ava";
import fs from "fs";
import path from "path";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";

/**
 * @hidden
 */
const testInterpolation: Macro<any> = (
  t: ExecutionContext,
  {
    input_table_range_with_headers,
    input_table_range_with_headers_fixture,
    method,
    expectedOutput,
    expectedOutput_fixture,
    page_size,
    page
  }
) => {
  let fixturePath;
  if (input_table_range_with_headers_fixture) {
    fixturePath = path.join(
      __dirname,
      "..",
      "fixtures",
      input_table_range_with_headers_fixture
    );
    input_table_range_with_headers = fs
      .readFileSync(fixturePath, "utf8")
      .split("\n")
      .map(row => row.split("\t"));
  }
  const output = GM_INTERPOLATE(
    input_table_range_with_headers,
    method,
    page_size,
    page
  );
  if (input_table_range_with_headers_fixture) {
    fs.writeFileSync(
      fixturePath + ".actual.json",
      JSON.stringify(output, null, 2)
    );
  } else {
    // t.log({ output, expectedOutput, page_size, page });
  }
  if (expectedOutput_fixture) {
    const expectedOutputFixturePath = path.join(
      __dirname,
      "..",
      "fixtures",
      expectedOutput_fixture
    );
    expectedOutput = JSON.parse(
      fs.readFileSync(expectedOutputFixturePath, "utf8")
    );
  }
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
      ["foo", "Foo", "1900", "0", "100"],
      ["foo", "Foo", "1905", "0", "105"]
    ],
    method: "linear",
    page_size: 3,
    page: 1,
    expectedOutput: [
      [
        "geo_id",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["foo", "Foo", 1900, 0, 100],
      ["foo", "Foo", 1901, 0, 101]
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
    page_size: 3,
    page: 2,
    expectedOutput: [
      ["foo", "Foo", 1902, 0, 102],
      ["foo", "Foo", 1903, 0, 103],
      ["foo", "Foo", 1904, 0, 104]
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
    page_size: 3,
    page: 3,
    expectedOutput: [["foo", "Foo", 1905, 0, 105]]
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
      ["foo", "Foo", 1901, null, 100.98057977],
      ["foo", "Foo", 1902, null, 101.9707749],
      ["foo", "Foo", 1903, null, 102.97067969],
      ["foo", "Foo", 1904, null, 103.98038934],
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
  },
  {
    input_table_range_with_headers: [
      [
        "geo",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["geo", "Georgia", "1900", "0", "100"],
      ["geo", "Georgia", "1905", "0", "105"]
    ],
    method: "linear",
    expectedOutput: [
      [
        "geo",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["geo", "Georgia", 1900, 0, 100],
      ["geo", "Georgia", 1901, 0, 101],
      ["geo", "Georgia", 1902, 0, 102],
      ["geo", "Georgia", 1903, 0, 103],
      ["geo", "Georgia", 1904, 0, 104],
      ["geo", "Georgia", 1905, 0, 105]
    ]
  },
  {
    input_table_range_with_headers: [
      [
        "geo",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["geo", "Georgia", "1900", "0", "100"],
      ["geo", "Georgia", "1905", "0", "105"],
      ["geo", "Georgia", "1906", "0", ""],
      ["geo", "Georgia", "1907", "0", ""],
      ["geo", "Georgia", "1908", "0", "108"]
    ],
    method: "linear",
    expectedOutput: [
      [
        "geo",
        "geo_name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["geo", "Georgia", 1900, 0, 100],
      ["geo", "Georgia", 1901, 0, 101],
      ["geo", "Georgia", 1902, 0, 102],
      ["geo", "Georgia", 1903, 0, 103],
      ["geo", "Georgia", 1904, 0, 104],
      ["geo", "Georgia", 1905, 0, 105],
      ["geo", "Georgia", 1906, 0, null],
      ["geo", "Georgia", 1907, 0, null],
      ["geo", "Georgia", 1908, 0, 108]
    ]
  },
  // Note: Due to the large size of the following test fixture, ava may choke
  // on displaying a diff (RangeError {message: 'Maximum call stack size exceeded'})
  // Workaround: Manually diff the .expected.json and .actual.json
  {
    input_table_range_with_headers_fixture: "gdppcap-for-countries-etc.tsv",
    method: "linear",
    expectedOutput_fixture: "gdppcap-for-countries-etc.tsv.expected.json"
  },
  {
    input_table_range_with_headers_fixture:
      "doubt-t315-mobil_money_account - indicator_input_data.tsv",
    method: "zerofill",
    expectedOutput_fixture:
      "doubt-t315-mobil_money_account - indicator_input_data.tsv.expected.json"
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testInterpolation - " + index, testInterpolation, testData);
});
