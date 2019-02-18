import {
  FasttrackCatalogDataPointsDataRow,
  FasttrackCatalogDataPointsWorksheetData
} from "./fastttrackCatalog";
import {
  conceptDataDocWorksheetReferencesByGeographyAndTimeUnit,
  geographyToFasttrackCatalogGeographyMap
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
  geography,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  if (!geography) {
    geography = "countries_etc";
  }
  const fasttrackCatalogGeography =
    geographyToFasttrackCatalogGeographyMap[geography];
  const matchingConcepts = fasttrackCatalogDataPointsWorksheetData.rows.filter(
    (row: FasttrackCatalogDataPointsDataRow) => {
      return (
        row.concept_id === concept_id &&
        row.time_unit === time_unit &&
        row.geography === fasttrackCatalogGeography
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
  const matchingConcept = matchingConcepts[0];
  if (!conceptDataDocWorksheetReferencesByGeographyAndTimeUnit[geography]) {
    throw new Error(`Unsupported Gapminder geography: "${geography}"`);
  }
  if (
    !conceptDataDocWorksheetReferencesByGeographyAndTimeUnit[geography][
      time_unit
    ]
  ) {
    throw new Error(
      `Unsupported time_unit for geography "${geography}": "${time_unit}"`
    );
  }
  const worksheetCsvDataHTTPResponse = UrlFetchApp.fetch(
    matchingConcept.csv_link
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
