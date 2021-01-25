import test, { ExecutionContext, Macro } from "ava";
import { MinimalUrlFetchApp } from "../lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "../lib/MinimalUtilities";
import {
  getOpenNumbersDatasetConceptListing,
  OpenNumbersDatasetConceptListingDataRow
} from "./openNumbersDataset";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const expectedFirstRowOutputHeaders = [
  "dataset_id",
  "geo_set",
  "time_unit",
  "concept_id",
  "concept_name",
  "csv_link"
];

/**
 * @hidden
 */
const testGetOpenNumbersDatasetConceptListing: Macro<any> = (
  t: ExecutionContext,
  { repository, expectRequestException }
) => {
  let requestExceptionOccurred = false;
  try {
    const output: OpenNumbersDatasetConceptListingDataRow[] = getOpenNumbersDatasetConceptListing(
      repository
    );
    const outputHeaders = Object.keys(output[0]);
    // t.log({ outputHeaders, expectedFirstRowOutputHeaders });
    t.deepEqual(outputHeaders, expectedFirstRowOutputHeaders);
  } catch (e) {
    if (e.name === "UrlFetchAppFetchException") {
      requestExceptionOccurred = true;
    } else {
      throw e;
    }
  }
  t.deepEqual(requestExceptionOccurred, expectRequestException);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    repository: "ddf--open_numbers--world_development_indicators",
    expectRequestException: false
  },
  {
    repository: "ddf--open_numbers--this_does_not_exist",
    expectRequestException: true
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testGetOpenNumbersDatasetConceptListing - " + index,
    testGetOpenNumbersDatasetConceptListing,
    testData
  );
});
