import { fetchWorksheetData } from "./fetchWorksheetData";
import {
  fasttrackCatalogDocDataPointsWorksheetReference,
  fasttrackCatalogDocSpreadsheetId
} from "./hardcodedConstants";
import { ListFasttrackCatalogDataPoints } from "./types/listFasttrackCatalogDataPoints";

/**
 * @hidden
 */
export interface FasttrackCatalogDataPointsDataRow {
  /* tslint:disable:object-literal-sort-keys */
  geo_set: string;
  time_unit: string;
  concept_id: string;
  dimensions: string;
  concept_name: string;
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
interface FasttrackCatalogDataPointsLookupTable {
  [alias: string]: FasttrackCatalogDataPointsDataRow;
}

/**
 * @hidden
 */
export function getFasttrackCatalogDataPointsList() {
  const worksheetDataResponse: ListFasttrackCatalogDataPoints.Response = fetchWorksheetData(
    fasttrackCatalogDocSpreadsheetId,
    fasttrackCatalogDocDataPointsWorksheetReference
  );
  return gsheetsDataApiFeedsListFasttrackCatalogDataPointsResponseToWorksheetData(
    worksheetDataResponse
  );
}

/**
 * @hidden
 */
function gsheetsDataApiFeedsListFasttrackCatalogDataPointsResponseToWorksheetData(
  r: ListFasttrackCatalogDataPoints.Response
): FasttrackCatalogDataPointsWorksheetData {
  const rows = r.feed.entry.map(currentValue => {
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo_set: currentValue.gsx$geography.$t,
      time_unit: currentValue.gsx$timeunit.$t,
      concept_id: currentValue.gsx$conceptid.$t,
      dimensions: currentValue.gsx$dimensions.$t,
      concept_name: currentValue.gsx$conceptname.$t,
      table_format: currentValue.gsx$tableformat.$t,
      csv_link: currentValue.gsx$csvlink.$t,
      doc_id: currentValue.gsx$docid.$t.replace(/\/.*/, "") // Since sometimes the gsheet values for doc_id has included /edit#gid=0000 after the actual doc id
      /* tslint:enable:object-literal-sort-keys */
    };
  });
  return {
    rows
  };
}
