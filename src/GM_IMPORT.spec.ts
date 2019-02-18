import test, { ExecutionContext, Macro } from "ava";
import { GM_IMPORT } from "./GM_IMPORT";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmImport: Macro<any> = (
  t: ExecutionContext,
  { concept_id, time_unit, geography, expectedTopFiveRowsOfOutput }
) => {
  const output = GM_IMPORT(concept_id, time_unit, geography);
  const topFiveRowsOfOutput = output.slice(0, 5);
  // t.log({ topFiveRowsOfOutput, expectedTopFiveRowsOfOutput });
  t.deepEqual(topFiveRowsOfOutput, expectedTopFiveRowsOfOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    concept_id: "pop",
    time_unit: "year",
    geography: "global",
    expectedTopFiveRowsOfOutput: [
      ["geo", "name", "year", "pop"],
      ["world", "World", "1800", "946,764,816"],
      ["world", "World", "1801", "950,949,353"],
      ["world", "World", "1802", "955,168,653"],
      ["world", "World", "1803", "959,430,074"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmImport - " + index, testGmImport, testData);
});
