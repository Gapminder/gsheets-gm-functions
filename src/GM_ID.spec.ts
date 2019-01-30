import test, { ExecutionContext, Macro } from "ava";
import { GM_ID } from "./GM_ID";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
(global as any).UrlFetchApp = MinimalUrlFetchApp;

/**
 * @hidden
 */
const testGmId: Macro<any> = (
  t: ExecutionContext,
  { column_range_with_headers, concept_id, expectedOutput }
) => {
  const output = GM_ID(column_range_with_headers, concept_id);
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    column_range_with_headers: [["Country"], ["foo"]],
    concept_id: "countries_etc",
    expectedOutput: [["geo"], ["Unknown alias: foo"]]
  },
  {
    column_range_with_headers: [["Country"], ["foo"], [""], [""]],
    concept_id: "countries_etc",
    expectedOutput: [["geo"], ["Unknown alias: foo"]]
  },
  {
    column_range_with_headers: [
      ["Country"],
      ["Albania"],
      ["Albania*"],
      ["Albania "],
      ["Usa"]
    ],
    concept_id: "countries_etc",
    expectedOutput: [
      ["geo"],
      ["alb"],
      ["Unknown alias: Albania*"],
      ["Unknown alias: Albania "],
      ["Unknown alias: Usa"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmId - " + index, testGmId, testData);
});
