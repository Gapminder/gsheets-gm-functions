import test, { ExecutionContext, Macro } from "ava";
import { GM_PROP_AGGR } from "./GM_PROP_AGGR";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
(global as any).UrlFetchApp = MinimalUrlFetchApp;

/**
 * @hidden
 */
const testGmPropAggr: Macro<any> = (
  t: ExecutionContext,
  { input_table_range_with_headers, aggregation_property_id, expectedOutput }
) => {
  const output = GM_PROP_AGGR(
    input_table_range_with_headers,
    aggregation_property_id
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
      ["foo", "Foo", "1900", "0", "100"]
    ],
    aggregation_property_id: "four_regions",
    expectedOutput: [
      [
        "four_regions",
        "name",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["Unknown geo: foo", "Unknown alias: Unknown geo: foo", "1900", 0, 100]
    ]
  },
  {
    input_table_range_with_headers: [
      [
        "geo",
        "name",
        "year",
        "occurrence",
        "Total deaths - Earthquakes",
        "Injured - Earthquakes",
        "Affected - Earthquakes",
        "Total deaths - Storms",
        "Injured - Storms",
        "Affected - Storms"
      ],
      ["blr", "Belarus", 1906, 1, 666, 666, 7, "", 6, 6750],
      ["bel", "Belgium", 1907, 1, 1000, 6666, 57, 67, 6, 67],
      ["blz", "Belize", 1908, 2, 7300, 2345, 66, "", 7, 5],
      ["ben", "Benin", 1909, 1, 2000, 256, 666, 567, 56, 5],
      ["btn", "Bhutan", 1910, 2, 6, "", 666, 56, 756, 6],
      ["bol", "Bolivia", 1911, 1, 1099, 56, 14, 7, 7, 8],
      ["bih", "Bosnia and Herzegovina", 1912, 1, "", "", 666, 546, 57, 45],
      ["bwa", "Botswana", 1913, 1, "", 54, 3574, 4, "", 20000],
      ["bra", "Brazil", 1906, 2, "", 3, "", "", 76, 4],
      ["brn", "Brunei", 1907, 1, 34, 54, 53, 68, 19, 8],
      ["blr", "Belarus", 1908, 1, 24, 5, 357, 68, "", 8],
      ["bel", "Belgium", 1909, 1, 700, 7, 666, 6, 767, 46],
      ["blz", "Belize", 1910, 1, 12000, 345, 666, 68, "", 578],
      ["ben", "Benin", 1911, 1, 400, 7, "", 68, "", ""],
      ["btn", "Bhutan", 1912, 1, 1200, 66, 90000, 8, 90000, 30000],
      ["bol", "Bolivia", 1913, 1, 41, 5, 666, 48, 6, 5]
    ],
    aggregation_property_id: "four_regions",
    expectedOutput: [
      [
        "four_regions",
        "name",
        "year",
        "occurrence",
        "Total deaths - Earthquakes",
        "Injured - Earthquakes",
        "Affected - Earthquakes",
        "Total deaths - Storms",
        "Injured - Storms",
        "Affected - Storms"
      ],
      ["africa", "Africa", 1909, 1, 2000, 256, 666, 567, 56, 5],
      ["africa", "Africa", 1911, 1, 400, 7, 0, 68, 0, 0],
      ["africa", "Africa", 1913, 1, 0, 54, 3574, 4, 0, 20000],
      ["americas", "The Americas", 1906, 2, 0, 3, 0, 0, 76, 4],
      ["americas", "The Americas", 1908, 2, 7300, 2345, 66, 0, 7, 5],
      ["americas", "The Americas", 1910, 1, 12000, 345, 666, 68, 0, 578],
      ["americas", "The Americas", 1911, 1, 1099, 56, 14, 7, 7, 8],
      ["americas", "The Americas", 1913, 1, 41, 5, 666, 48, 6, 5],
      ["asia", "Asia", 1907, 1, 34, 54, 53, 68, 19, 8],
      ["asia", "Asia", 1910, 2, 6, 0, 666, 56, 756, 6],
      ["asia", "Asia", 1912, 1, 1200, 66, 90000, 8, 90000, 30000],
      ["europe", "Europe", 1906, 1, 666, 666, 7, 0, 6, 6750],
      ["europe", "Europe", 1907, 1, 1000, 6666, 57, 67, 6, 67],
      ["europe", "Europe", 1908, 1, 24, 5, 357, 68, 0, 8],
      ["europe", "Europe", 1909, 1, 700, 7, 666, 6, 767, 46],
      ["europe", "Europe", 1912, 1, 0, 0, 666, 546, 57, 45]
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
    aggregation_property_id: "World bank, 4 income groups 2017",
    expectedOutput: [
      [
        "World bank, 4 income groups 2017",
        "World bank, 4 income groups 2017",
        "year",
        "Overall score",
        "Electoral process and pluralism"
      ],
      ["Unknown geo: foo", "Unknown geo: foo", "1900", 0, 100]
    ]
  },
  {
    input_table_range_with_headers: [
      [
        "geo",
        "name",
        "year",
        "occurrence",
        "Total deaths - Earthquakes",
        "Injured - Earthquakes",
        "Affected - Earthquakes",
        "Total deaths - Storms",
        "Injured - Storms",
        "Affected - Storms"
      ],
      ["blr", "Belarus", 1906, 1, 666, 666, 7, "", 6, 6750],
      ["bel", "Belgium", 1907, 1, 1000, 6666, 57, 67, 6, 67],
      ["blz", "Belize", 1908, 2, 7300, 2345, 66, "", 7, 5],
      ["ben", "Benin", 1909, 1, 2000, 256, 666, 567, 56, 5],
      ["btn", "Bhutan", 1910, 2, 6, "", 666, 56, 756, 6],
      ["bol", "Bolivia", 1911, 1, 1099, 56, 14, 7, 7, 8],
      ["bih", "Bosnia and Herzegovina", 1912, 1, "", "", 666, 546, 57, 45],
      ["bwa", "Botswana", 1913, 1, "", 54, 3574, 4, "", 20000],
      ["bra", "Brazil", 1906, 2, "", 3, "", "", 76, 4],
      ["brn", "Brunei", 1907, 1, 34, 54, 53, 68, 19, 8],
      ["blr", "Belarus", 1908, 1, 24, 5, 357, 68, "", 8],
      ["bel", "Belgium", 1909, 1, 700, 7, 666, 6, 767, 46],
      ["blz", "Belize", 1910, 1, 12000, 345, 666, 68, "", 578],
      ["ben", "Benin", 1911, 1, 400, 7, "", 68, "", ""],
      ["btn", "Bhutan", 1912, 1, 1200, 66, 90000, 8, 90000, 30000],
      ["bol", "Bolivia", 1913, 1, 41, 5, 666, 48, 6, 5]
    ],
    aggregation_property_id: "World bank, 4 income groups 2017",
    expectedOutput: [
      [
        "World bank, 4 income groups 2017",
        "World bank, 4 income groups 2017",
        "year",
        "occurrence",
        "Total deaths - Earthquakes",
        "Injured - Earthquakes",
        "Affected - Earthquakes",
        "Total deaths - Storms",
        "Injured - Storms",
        "Affected - Storms"
      ],
      ["High income", "High income", 1907, 2, 1034, 6720, 110, 135, 25, 75],
      ["High income", "High income", 1909, 1, 700, 7, 666, 6, 767, 46],
      ["Low income", "Low income", 1909, 1, 2000, 256, 666, 567, 56, 5],
      ["Low income", "Low income", 1911, 1, 400, 7, 0, 68, 0, 0],
      [
        "Lower middle income",
        "Lower middle income",
        1910,
        2,
        6,
        0,
        666,
        56,
        756,
        6
      ],
      [
        "Lower middle income",
        "Lower middle income",
        1911,
        1,
        1099,
        56,
        14,
        7,
        7,
        8
      ],
      [
        "Lower middle income",
        "Lower middle income",
        1912,
        1,
        1200,
        66,
        90000,
        8,
        90000,
        30000
      ],
      [
        "Lower middle income",
        "Lower middle income",
        1913,
        1,
        41,
        5,
        666,
        48,
        6,
        5
      ],
      [
        "Upper middle income",
        "Upper middle income",
        1906,
        3,
        666,
        669,
        7,
        0,
        82,
        6754
      ],
      [
        "Upper middle income",
        "Upper middle income",
        1908,
        3,
        7324,
        2350,
        423,
        68,
        7,
        13
      ],
      [
        "Upper middle income",
        "Upper middle income",
        1910,
        1,
        12000,
        345,
        666,
        68,
        0,
        578
      ],
      [
        "Upper middle income",
        "Upper middle income",
        1912,
        1,
        0,
        0,
        666,
        546,
        57,
        45
      ],
      [
        "Upper middle income",
        "Upper middle income",
        1913,
        1,
        0,
        54,
        3574,
        4,
        0,
        20000
      ]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmPropAggr - " + index, testGmPropAggr, testData);
});
