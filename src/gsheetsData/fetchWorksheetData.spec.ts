import test, { ExecutionContext, Macro } from "ava";
import { MinimalUrlFetchApp } from "../lib/MinimalUrlFetchApp";
import { fetchWorksheetData } from "./fetchWorksheetData";
import {
  conceptDataDocWorksheetReferencesByGeographyAndTimeUnit,
  conceptDatasetTemplateSpreadsheetId
} from "./hardcodedConstants";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
/**
 * @hidden
 */
const testFetchWorksheetData: Macro<any> = (
  t: ExecutionContext,
  { spreadsheetId, worksheetReference }
) => {
  const output = fetchWorksheetData(spreadsheetId, worksheetReference);
  // t.log({ output });
  t.truthy(output);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    spreadsheetId: conceptDatasetTemplateSpreadsheetId,
    worksheetReference:
      conceptDataDocWorksheetReferencesByGeographyAndTimeUnit.global.year
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test("testFetchWorksheetData - " + index, testFetchWorksheetData, testData);
});
