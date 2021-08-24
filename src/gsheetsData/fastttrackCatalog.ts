import { fetchWorksheetData, WorksheetData } from "./fetchWorksheetData";
import {
  fasttrackCatalogDocDataPointsWorksheetReference,
  fasttrackCatalogDocSpreadsheetId
} from "./hardcodedConstants";
import { sanityCheckHeaders } from "./sanityCheckHeaders";

/**
 * @hidden
 */
export interface FasttrackCatalogDataPointsDataRow {
  /* tslint:disable:object-literal-sort-keys */
  dataset_id: string;
  indicator_order: string;
  geo_set: string;
  time_unit: string;
  concept_id: string;
  dimensions: string;
  concept_name: string;
  concept_version: string;
  table_format: string;
  csv_link: string;
  doc_id: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
export interface FasttrackCatalogDataPointsWorksheetData {
  rows: FasttrackCatalogDataPointsDataRow[];
}

/**
 * @hidden
 */
export function getFasttrackCatalogDataPointsList() {
  const worksheetDataResponse = fetchWorksheetData(
    fasttrackCatalogDocSpreadsheetId,
    fasttrackCatalogDocDataPointsWorksheetReference
  );
  return gsheetsWorksheetDataToFasttrackCatalogDataPointsWorksheetData(
    worksheetDataResponse
  );
}

/**
 * @hidden
 */
function gsheetsWorksheetDataToFasttrackCatalogDataPointsWorksheetData(
  worksheetData: WorksheetData
): FasttrackCatalogDataPointsWorksheetData {
  // Separate the header row from the data rows
  const headers = worksheetData.values.shift();
  // Sanity check headers
  const expectedHeaders = [
    "dataset_id", // 0
    "indicator order",
    "geography",
    "time unit",
    "concept_id",
    "dimensions", // 5
    "concept_name", // 6
    "table_format",
    "csv_link",
    "",
    "DataBase name for time", // 10
    "key",
    "doc_id",
    "doc-link",
    "concept_id",
    "name_short", // 15
    "concept_version",
    "Database name of geo set",
    "sheet name"
  ];

  sanityCheckHeaders(
    headers,
    expectedHeaders,
    "FasttrackCatalogDataPointsWorksheet"
  );
  // Interpret the data rows based on position
  const rows = worksheetData.values.map(worksheetDataRow => {
    return {
      /* tslint:disable:object-literal-sort-keys */
      dataset_id: worksheetDataRow[0],
      indicator_order: worksheetDataRow[1],
      geo_set: worksheetDataRow[2],
      time_unit: worksheetDataRow[3],
      concept_id: worksheetDataRow[4],
      dimensions: worksheetDataRow[5],
      concept_name: worksheetDataRow[6],
      concept_version: worksheetDataRow[16],
      table_format: worksheetDataRow[7],
      csv_link: worksheetDataRow[8],
      doc_id: worksheetDataRow[12]
      /* tslint:enable:object-literal-sort-keys */
    };
  });
  return {
    rows
  };
}
