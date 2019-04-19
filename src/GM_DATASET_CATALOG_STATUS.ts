import { getConceptDataFasttrackCatalogEntry } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";
import { fetchWorksheetReferences } from "./gsheetsData/fetchWorksheetReferences";
import { conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit } from "./gsheetsData/hardcodedConstants";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";
import { validateConceptIdArgument } from "./lib/validateConceptIdArgument";
import { getOpenNumbersDatasetConceptDataEntry } from "./openNumbersData/conceptData";
import { getOpenNumbersDatasetConceptListing } from "./openNumbersData/opennumbersCatalog";

/**
 * Checks if the referenced data is available remotely for use by GM_* functions.
 *
 * Runs the basic validation checks against the referenced dataset making sure that
 *  - it is listed in the fasttrack catalog
 *  - the relevant "data-" worksheet in the dataset source document is published
 *
 * Returns "GOOD" or "BAD" (Or "BAD: What is bad... " if the verbose flag is TRUE).
 *
 * Note: The function results are not automatically re-evaluated as changes are made to the source documents or the catalog. You can trigger a manual update by deleting the cell and undoing the deletion immediately.
 *
 * @param dataset_reference The dataset reference in the form of {concept id}@{catalog} (eg "pop@fasttrack", or "pop@opennumbers") of which concept data to check status for
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept data to check status for
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @param verbose Explains how a certain dataset is invalid instead of simply returning "BAD" for the row
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATASET_CATALOG_STATUS(
  dataset_reference: string,
  time_unit: string,
  geo_set: string,
  verbose: boolean
) {
  // Default argument value
  if (verbose === undefined) {
    verbose = false;
  }

  try {
    if (dataset_reference === "") {
      throw new Error("The dataset reference argument is empty");
    }
    const parsedDatasetReference = dataset_reference.split("@");
    const concept_id = parsedDatasetReference[0];
    validateConceptIdArgument(concept_id);
    // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
    validateAndAliasTheGeoSetArgument(geo_set);
    const catalog = parsedDatasetReference[1];
    switch (catalog) {
      case undefined:
      case "":
      case "fasttrack":
        {
          validateFasttrackCatalogStatus(concept_id, time_unit, geo_set);
        }
        break;
      case "open-numbers-wdi":
      case "open-numbers/ddf--open_numbers--world_development_indicators":
        {
          validateOpenNumbersDatasetStatus(
            "ddf--open_numbers--world_development_indicators",
            concept_id,
            time_unit,
            geo_set
          );
        }
        break;
      default: {
        throw new Error(`Unknown catalog: "${catalog}"`);
      }
    }
    return [["GOOD"]];
  } catch (err) {
    return [["BAD" + (verbose ? ": " + err.message : "")]];
  }
}

/**
 * @hidden
 */
function validateFasttrackCatalogStatus(
  concept_id: string,
  time_unit: string,
  geo_set: string
) {
  const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();
  const conceptDataFasttrackCatalogEntry = getConceptDataFasttrackCatalogEntry(
    concept_id,
    time_unit,
    geo_set,
    fasttrackCatalogDataPointsWorksheetData
  );
  if (!conceptDataFasttrackCatalogEntry.csvLink) {
    throw new Error("No CSV Link");
  }
  // Compare worksheets with the expected ones defined in conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit
  const worksheetReferences = fetchWorksheetReferences(
    conceptDataFasttrackCatalogEntry.docId
  );
  const expectedWorksheetReference =
    conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit[geo_set][time_unit];
  if (
    worksheetReferences.filter(
      worksheetReference =>
        worksheetReference.name === expectedWorksheetReference.name
    ).length === 0
  ) {
    throw new Error(
      `A published "${
        expectedWorksheetReference.name
      }" worksheet was not found in the concept dataset source spreadsheet ("${
        conceptDataFasttrackCatalogEntry.docId
      }"). Currently published worksheets are currently "${worksheetReferences
        .map(worksheetReference => worksheetReference.name)
        .join(", ")}"`
    );
  }
}

/**
 * @hidden
 */
function validateOpenNumbersDatasetStatus(
  repository: string,
  concept_id: string,
  time_unit: string,
  geo_set: string
) {
  const openNumbersCatalogConceptListing = getOpenNumbersDatasetConceptListing(
    repository
  );
  const conceptDataOpenNumbersDatasetEntry = getOpenNumbersDatasetConceptDataEntry(
    concept_id,
    time_unit,
    geo_set,
    openNumbersCatalogConceptListing
  );
  if (!conceptDataOpenNumbersDatasetEntry.csvLink) {
    throw new Error("No CSV Link");
  }
}
