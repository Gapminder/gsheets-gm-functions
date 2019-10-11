import test, { ExecutionContext, Macro } from "ava";
import { GM_IMPORT_SLOW } from "./GM_IMPORT_SLOW";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmImportSlow: Macro<any> = (
  t: ExecutionContext,
  { concept_id, time_unit, geo_set, expectedTopFiveRowsOfOutput }
) => {
  const output = GM_IMPORT_SLOW(concept_id, time_unit, geo_set);
  const topFiveRowsOfOutput = output.slice(0, 5);
  // t.log({ topFiveRowsOfOutput, expectedTopFiveRowsOfOutput });
  t.deepEqual(topFiveRowsOfOutput, expectedTopFiveRowsOfOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    concept_id: "pop_gm_6",
    time_unit: "year",
    geo_set: "global",
    expectedTopFiveRowsOfOutput: [
      ["geo", "name", "year", "pop_gm_6"],
      ["world", "World", "1800", "946,764,816"],
      ["world", "World", "1801", "950,949,353"],
      ["world", "World", "1802", "955,168,653"],
      ["world", "World", "1803", "959,430,074"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  // Skipping until the concept data is available again in the fasttrack catalog
  test.skip("testGmImportSlow - " + index, testGmImportSlow, testData);
});
