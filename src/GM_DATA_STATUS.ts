import { getMatchingConcept } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";

/**
 * Checks if the referenced data is available remotely for import.
 * Returns "GOOD" or "BAD" (Or "BAD: What is bad... " if the verbose flag is TRUE).
 *
 * @param concept_id The concept id ("pop") of which concept data to check status for
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept data to check status for
 * @param geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param verbose Explains how a certain dataset is invalid instead of simply returning "BAD" for the row
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA_STATUS(
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
    const matchingConcept = getMatchingConcept(
      concept_id,
      time_unit,
      geography,
      fasttrackCatalogDataPointsWorksheetData
    );
    if (!matchingConcept.csv_link) {
      throw new Error("No CSV Link");
    }
    return [["GOOD"]];
  } catch (err) {
    return [["BAD" + (verbose ? ": " + err.message : "")]];
  }
}
