import test, { ExecutionContext, Macro } from "ava";
import { MinimalUrlFetchApp } from "../lib/MinimalUrlFetchApp";
import { fetchWorksheetReferences } from "./fetchWorksheetReferences";
import {
  conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit,
  conceptDatasetTemplateSpreadsheetId
} from "./hardcodedConstants";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
/**
 * @hidden
 */
const testFetchWorksheetReferences: Macro<any> = (
  t: ExecutionContext,
  { spreadsheetId, worksheetReference, expectedOutput }
) => {
  const output = fetchWorksheetReferences(spreadsheetId);
  // t.log({output, expectedOutput});
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    spreadsheetId: conceptDatasetTemplateSpreadsheetId,
    expectedOutput: [
      {
        name: "ABOUT",
        position: 1
      },
      conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit.global.year,
      conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit.world_4region.year,
      conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit.countries_etc.year
    ]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testFetchWorksheetReferences - " + index,
    testFetchWorksheetReferences,
    testData
  );
});
