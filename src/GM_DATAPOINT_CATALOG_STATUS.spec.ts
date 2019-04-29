import test, { ExecutionContext, Macro } from "ava";
import { GM_DATAPOINT_CATALOG_STATUS } from "./GM_DATAPOINT_CATALOG_STATUS";
import { MinimalUrlFetchApp } from "./lib/MinimalUrlFetchApp";
import { MinimalUtilities } from "./lib/MinimalUtilities";
(global as any).UrlFetchApp = MinimalUrlFetchApp;
(global as any).Utilities = MinimalUtilities;

/**
 * @hidden
 */
const testGmDatapointCatalogStatus: Macro<any> = (
  t: ExecutionContext,
  {
    concept_id_and_catalog_reference,
    time_unit,
    geo_set,
    verbose,
    expectedOutput
  }
) => {
  const output = GM_DATAPOINT_CATALOG_STATUS(
    concept_id_and_catalog_reference,
    time_unit,
    geo_set,
    verbose
  );
  // t.log({ output });
  t.deepEqual(output, expectedOutput);
};

[
  /* tslint:disable:object-literal-sort-keys */
  {
    concept_id_and_catalog_reference: "pop@fasttrack",
    time_unit: "year",
    geo_set: "countries_etc",
    verbose: true,
    expectedOutput: [["GOOD"]]
  },
  {
    concept_id_and_catalog_reference: "sp_pop_totl@open-numbers-wdi",
    time_unit: "year",
    geo_set: "countries_etc",
    verbose: true,
    expectedOutput: [["GOOD"]]
  }
  /* tslint:enable:object-literal-sort-keys */
].forEach((testData, index) => {
  // Skipping until the concept data is available again in the fasttrack catalog
  test(
    "testGmDatapointCatalogStatus - " + index,
    testGmDatapointCatalogStatus,
    testData
  );
});
