import test, { ExecutionContext, Macro } from "ava";
import { GM_CLEAN_TEXT } from "./GM_CLEAN_TEXT";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
(global as any).UrlFetchApp = MinimalUrlFetchApp;

/**
 * @hidden
 */
const testGmId: Macro<any> = (
  t: ExecutionContext,
  { range_with_headers, expectedOutput }
) => {
  const output = GM_CLEAN_TEXT(range_with_headers);
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    range_with_headers: [["Column header"], ["Foo"], ["Góo*"]],
    expectedOutput: [["Column header (clean)"], ["foo"], ["goo"]]
  },
  {
    range_with_headers: [
      ["Country"],
      ["Albania"],
      ["Albania*"],
      ["Albania "],
      ["Usa"],
      ["Iceland**"]
    ],
    concept_id: "countries_etc",
    expectedOutput: [
      ["Country (clean)"],
      ["albania"],
      ["albania"],
      ["albania"],
      ["usa"],
      ["iceland"]
    ]
  },
  {
    range_with_headers: [
      ["Column header 1", "Column header 2"],
      ["Foo", "Foo"],
      ["Góo*", "Zóo*"]
    ],
    expectedOutput: [
      ["Column header 1 (clean)", "Column header 2 (clean)"],
      ["foo", "foo"],
      ["goo", "zoo"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmId - " + index, testGmId, testData);
});
