import { ConceptDataRow } from "../lib/conceptDataRow";
import { OpenNumbersDatasetConceptListingDataRow } from "./opennumbersCatalog";
// import { listConceptDataByGeographyAndTimeUnit } from "./types/listConceptDataByGeographyAndTimeUnit";

/**
 * @hidden
 */
export function getOpenNumbersConceptData(
  concept_id,
  time_unit,
  geo_set,
  openNumbersCatalogConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  const matchingConcept = getOpenNumbersDatasetConceptDataEntry(
    concept_id,
    time_unit,
    geo_set,
    openNumbersCatalogConceptListing
  );
  const csvDataHTTPResponse = UrlFetchApp.fetch(matchingConcept.csvLink);
  const csvData = Utilities.parseCsv(csvDataHTTPResponse.getContentText());
  return listConceptDataCsvDataToConceptDataRows(csvData);
}

/**
 * @hidden
 */
export function getOpenNumbersDatasetConceptDataEntry(
  concept_id,
  time_unit,
  geo_set,
  openNumbersCatalogConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  const matchingConcept = getMatchingOpenNumbersDatasetConcept(
    concept_id,
    time_unit,
    geo_set,
    openNumbersCatalogConceptListing
  );
  return {
    csvLink: matchingConcept.csv_link
  };
}

/**
 * @hidden
 */
function getMatchingOpenNumbersDatasetConcept(
  concept_id,
  time_unit,
  geo_set,
  openNumbersCatalogConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  const matchingConcepts = openNumbersCatalogConceptListing.filter(
    (row: OpenNumbersDatasetConceptListingDataRow) => {
      return (
        row.concept_id === concept_id &&
        row.time_unit === time_unit &&
        row.geo_set === geo_set
      );
    }
  );
  if (matchingConcepts.length === 0) {
    throw new Error(
      `No concept matches concept_id "${concept_id}", time_unit "${time_unit}", geo_set "${geo_set}" in the given open-numbers dataset`
    );
  }
  if (matchingConcepts.length > 1) {
    throw new Error(
      `More than one concept matches concept_id "${concept_id}", time_unit "${time_unit}", geo_set "${geo_set}" in the given open-numbers dataset`
    );
  }
  return matchingConcepts[0];
}

/**
 * @hidden
 */
function listConceptDataCsvDataToConceptDataRows(csvData): ConceptDataRow[] {
  // Drop header row
  csvData.shift();
  // Interpret the remaining rows based on position
  return csvData.map(csvDataRow => {
    return {
      geo: csvDataRow[0],
      name: undefined,
      time: csvDataRow[1],
      value: csvDataRow[2]
    };
  });
}
