import {
  DataGeographiesGeoNameLookupTable,
  getDataGeographiesGeoNamesLookupTable
} from "../gsheetsData/dataGeographies";
import { ConceptDataWorksheetData } from "../lib/conceptData";
import { errorHandlingFetch } from "../lib/errorHandlingFetch";
import { OpenNumbersDatasetConceptListingDataRow } from "./openNumbersDataset";

/**
 * @hidden
 */
export function getOpenNumbersConceptData(
  concept_id,
  time_unit,
  geo_set,
  openNumbersDatasetConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  const matchingConcept = getOpenNumbersDatasetConceptDataEntry(
    concept_id,
    time_unit,
    geo_set,
    openNumbersDatasetConceptListing
  );
  const csvDataHTTPResponse = errorHandlingFetch(matchingConcept.csvLink);
  const csvData = Utilities.parseCsv(csvDataHTTPResponse.getContentText());
  return listOpenNumbersDatasetConceptDataCsvDataToWorksheetData(
    csvData,
    geo_set
  );
}

/**
 * @hidden
 */
export function getOpenNumbersDatasetConceptDataEntry(
  concept_id,
  time_unit,
  geo_set,
  openNumbersDatasetConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  const matchingConcept = getMatchingOpenNumbersDatasetConcept(
    concept_id,
    time_unit,
    geo_set,
    openNumbersDatasetConceptListing
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
  openNumbersDatasetConceptListing: OpenNumbersDatasetConceptListingDataRow[]
) {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  const matchingConcepts = openNumbersDatasetConceptListing.filter(
    (row: OpenNumbersDatasetConceptListingDataRow) => {
      return (
        row.concept_id === concept_id &&
        row.time_unit === time_unit &&
        (row.geo_set === geo_set || row.geo_set === "geo")
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
function listOpenNumbersDatasetConceptDataCsvDataToWorksheetData(
  csvData: string[][],
  geo_set: string
): ConceptDataWorksheetData {
  // Separate the header row from the data rows
  const headers = [csvData[0][0], "name", csvData[0][1], csvData[0][2]];
  const csvDataRows = csvData.slice(1);
  // Interpret the data rows based on position, applying geo set filter and geo name mapping
  const geoNameLookupTable: DataGeographiesGeoNameLookupTable = getDataGeographiesGeoNamesLookupTable(
    geo_set
  );
  const rowsRelatedToChosenGeoSetWithGeoNameLookedUp = [];
  csvDataRows.map(csvDataRow => {
    const dataRow = {
      geo: csvDataRow[0],
      name: undefined,
      time: csvDataRow[1],
      value: csvDataRow[2]
    };
    const geoNameLookup = geoNameLookupTable[dataRow.geo];
    if (geoNameLookup) {
      rowsRelatedToChosenGeoSetWithGeoNameLookedUp.push({
        geo: dataRow.geo,
        name: geoNameLookup.name,
        time: dataRow.time,
        value: dataRow.value
      });
    }
  });
  return {
    headers,
    rows: rowsRelatedToChosenGeoSetWithGeoNameLookedUp
  };
}
