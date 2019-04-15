import {
  FasttrackCatalogDataPointsDataRow,
  FasttrackCatalogDataPointsWorksheetData
} from "./fastttrackCatalog";
import {
  conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit,
  geoSetToFasttrackCatalogGeoSetMap
} from "./hardcodedConstants";
import { listConceptDataByGeographyAndTimeUnit } from "./types/listConceptDataByGeographyAndTimeUnit";

/**
 * @hidden
 */
export interface ConceptDataRow {
  /* tslint:disable:object-literal-sort-keys */
  geo: string;
  name: string;
  time: string;
  value: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
interface ConceptDataWorksheetData {
  rows: ConceptDataRow[];
}

/**
 * @hidden
 */
export function getConceptDataWorksheetData(
  concept_id,
  time_unit,
  geo_set,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  const matchingConcept = getConceptDataCatalogEntry(
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
  return listConceptDataByGeographyAndTimeUnitWorksheetCsvDataToWorksheetData(
    worksheetCsvData
  );
}

/**
 * @hidden
 */
export function getConceptDataCatalogEntry(
  concept_id,
  time_unit,
  geo_set,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  const matchingConcept = getMatchingConcept(
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
function getMatchingConcept(
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
function listConceptDataByGeographyAndTimeUnitWorksheetCsvDataToWorksheetData(
  worksheetCsvData
): ConceptDataWorksheetData {
  // Drop header row
  worksheetCsvData.shift();
  // Interpret the remaining rows based on position
  const rows = worksheetCsvData.map(csvDataRow => {
    return {
      geo: csvDataRow[0],
      name: csvDataRow[1],
      time: csvDataRow[2],
      value: csvDataRow[3]
    };
  });
  return {
    rows
  };
}
