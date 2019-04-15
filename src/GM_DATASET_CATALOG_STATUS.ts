import { getConceptDataCatalogEntry } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";
import { fetchWorksheetReferences } from "./gsheetsData/fetchWorksheetReferences";
import { conceptDataDocWorksheetReferencesByGeographyAndTimeUnit } from "./gsheetsData/hardcodedConstants";

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
 * @param concept_id The concept id ("pop") of which concept data to check status for
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept data to check status for
 * @param geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param verbose Explains how a certain dataset is invalid instead of simply returning "BAD" for the row
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATASET_CATALOG_STATUS(
  concept_id: string,
  time_unit: string,
  geography: string,
  verbose: boolean
) {
  // Default argument value
  if (verbose === undefined) {
    verbose = false;
  }
  try {
    const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();
    const conceptDataCatalogEntry = getConceptDataCatalogEntry(
      concept_id,
      time_unit,
      geography,
      fasttrackCatalogDataPointsWorksheetData
    );
    if (!conceptDataCatalogEntry.csvLink) {
      throw new Error("No CSV Link");
    }
    // Compare worksheets with the expected ones defined in conceptDataDocWorksheetReferencesByGeographyAndTimeUnit
    const worksheetReferences = fetchWorksheetReferences(
      conceptDataCatalogEntry.docId
    );
    const expectedWorksheetReference =
      conceptDataDocWorksheetReferencesByGeographyAndTimeUnit[geography][
        time_unit
      ];
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
          conceptDataCatalogEntry.docId
        }"). Currently published worksheets are currently "${worksheetReferences
          .map(worksheetReference => worksheetReference.name)
          .join(", ")}"`
      );
    }
    return [["GOOD"]];
  } catch (err) {
    return [["BAD" + (verbose ? ": " + err.message : "")]];
  }
}
