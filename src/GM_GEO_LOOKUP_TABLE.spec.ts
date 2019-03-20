import test, { ExecutionContext, Macro } from "ava";
import { GM_GEO_LOOKUP_TABLE } from "./GM_GEO_LOOKUP_TABLE";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmGeoLookupTable: Macro<any> = (
  t: ExecutionContext,
  { geography, expectedTopFiveRowsOfOutput }
) => {
  const output = GM_GEO_LOOKUP_TABLE(geography);
  const topFiveRowsOfOutput = output.slice(0, 5);
  // t.log({ topFiveRowsOfOutput, expectedTopFiveRowsOfOutput });
  t.deepEqual(topFiveRowsOfOutput, expectedTopFiveRowsOfOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    geography: "world_4region",
    expectedTopFiveRowsOfOutput: [
      ["alias", "geo", "name"],
      ["Africa", "africa", "Africa"],
      ["africa", "africa", "Africa"],
      ["africa (total)", "americas", "The Americas"],
      ["Africa (total)", "americas", "The Americas"]
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testGmGeoLookupTable - " + index, testGmGeoLookupTable, testData);
});
