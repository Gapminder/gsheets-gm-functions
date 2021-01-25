import test, { ExecutionContext, Macro } from "ava";
import { ConceptDataWorksheetData } from "../lib/conceptData";
import { MinimalUrlFetchApp } from "../lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "../lib/MinimalUtilities";
import { getOpenNumbersConceptData } from "./conceptData";
import {
  getOpenNumbersDatasetConceptListing,
  OpenNumbersDatasetConceptListingDataRow
} from "./openNumbersDataset";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGetOpenNumbersConceptData: Macro<any> = (
  t: ExecutionContext,
  {
    concept_id,
    time_unit,
    geo_set,
    expectedOutputHeaders,
    expectRequestException
  }
) => {
  let requestExceptionOccurred = false;
  const openNumbersWorldDevelopmentIndicatorsDatasetConceptListing: OpenNumbersDatasetConceptListingDataRow[] = getOpenNumbersDatasetConceptListing(
    "ddf--open_numbers--world_development_indicators"
  );
  try {
    const output: ConceptDataWorksheetData = getOpenNumbersConceptData(
      concept_id,
      time_unit,
      geo_set,
      openNumbersWorldDevelopmentIndicatorsDatasetConceptListing
    );
    const outputHeaders = output.headers;
    // t.log({ outputHeaders, expectedOutputHeaders });
    t.deepEqual(outputHeaders, expectedOutputHeaders);
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
    concept_id: "sp_rur_totl_zs",
    time_unit: "year",
    geo_set: "countries_etc",
    expectedOutputHeaders: ["geo", "name", "time", "sp_rur_totl_zs"],
    expectRequestException: false
  }
  /*
  // TODO: This gets caught in getMatchingOpenNumbersDatasetConcept before the request is made
  // Once datapackage.json is used instead of the csv concept listing, this test becomes irrelevant
  {
    concept_id: "this_does_not_exist",
    time_unit: "year",
    geo_set: "countries_etc",
    expectedOutputHeaders: undefined,
    expectRequestException: true
  }
   */
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  test(
    "testGetOpenNumbersConceptData - " + index,
    testGetOpenNumbersConceptData,
    testData
  );
});
