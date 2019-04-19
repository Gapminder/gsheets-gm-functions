import { ConceptDataWorksheetData } from "../lib/conceptData";
import {
  FasttrackCatalogDataPointsDataRow,
  FasttrackCatalogDataPointsWorksheetData
} from "./fastttrackCatalog";
import {
  conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit,
  geoSetToFasttrackCatalogGeoSetMap
} from "./hardcodedConstants";

/**
 * @hidden
 */
export function getFasttrackCatalogConceptDataWorksheetData(
  concept_id,
  time_unit,
  geo_set,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
): ConceptDataWorksheetData {
  const matchingConcept = getConceptDataFasttrackCatalogEntry(
    concept_id,
    time_unit,
    geo_set,
    fasttrackCatalogDataPointsWorksheetData
  );
  const worksheetCsvDataHTTPResponse = UrlFetchApp.fetch(
    matchingConcept.csvLink
  );
  const worksheetCsvData = Utilities.parseCsv(
    worksheetCsvDataHTTPResponse.getContentText()
  );
  return listFasttrackCatalogConceptDataCsvDataToWorksheetData(
    worksheetCsvData
  );
}

/**
 * @hidden
 */
export function getConceptDataFasttrackCatalogEntry(
  concept_id,
  time_unit,
  geo_set,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  const matchingConcept = getMatchingFasttrackCatalogConcept(
    concept_id,
    time_unit,
    geo_set,
    fasttrackCatalogDataPointsWorksheetData
  );
  if (!conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit[geo_set]) {
    throw new Error(`Unsupported Gapminder geo_set: "${geo_set}"`);
  }
  if (
    !conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit[geo_set][time_unit]
  ) {
    throw new Error(
      `Unsupported time_unit for geo_set "${geo_set}": "${time_unit}"`
    );
  }
  return {
    csvLink: matchingConcept.csv_link,
    docId: matchingConcept.doc_id,
    worksheetReference:
      conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit[geo_set][time_unit]
  };
}

/**
 * @hidden
 */
function getMatchingFasttrackCatalogConcept(
  concept_id,
  time_unit,
  geo_set,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  const fasttrackCatalogGeography = geoSetToFasttrackCatalogGeoSetMap[geo_set];
  const matchingConcepts = fasttrackCatalogDataPointsWorksheetData.rows.filter(
    (row: FasttrackCatalogDataPointsDataRow) => {
      return (
        row.concept_id === concept_id &&
        row.time_unit === time_unit &&
        row.geo_set === fasttrackCatalogGeography
      );
    }
  );
  if (matchingConcepts.length === 0) {
    throw new Error(
      `No concept matches concept_id "${concept_id}", time_unit "${time_unit}", fasttrackCatalogGeography "${fasttrackCatalogGeography}" in the fasttrack catalog`
    );
  }
  if (matchingConcepts.length > 1) {
    throw new Error(
      `More than one concept matches concept_id "${concept_id}", time_unit "${time_unit}", fasttrackCatalogGeography "${fasttrackCatalogGeography}" in the fasttrack catalog`
    );
  }
  return matchingConcepts[0];
}

/**
 * @hidden
 */
function listFasttrackCatalogConceptDataCsvDataToWorksheetData(
  csvData
): ConceptDataWorksheetData {
  // Separate the header row from the data rows
  const headers = csvData[0];
  // Interpret the data rows based on position
  const rows = csvData.map(csvDataRow => {
    return {
      geo: csvDataRow[0],
      name: csvDataRow[1],
      time: csvDataRow[2],
      value: csvDataRow[3]
    };
  });
  return {
    headers,
    rows
  };
}
