import { fetchWorksheetData } from "./gsheetsData/fetchWorksheetData";
import { ListFasttrackCatalogDataPoints } from "./gsheetsDataApiFeeds/listFasttrackCatalogDataPoints";
import {
  fasttrackCatalogDocDataPointsWorksheetName,
  fasttrackCatalogDocDataPointsWorksheetReference,
  fasttrackCatalogDocSpreadsheetId
} from "./hardcodedConstants";

/**
 * @hidden
 */
interface FasttrackCatalogDataPointsDataRow {
  /* tslint:disable:object-literal-sort-keys */
  geography: string;
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
interface FasttrackCatalogDataPointsWorksheetData {
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
    fasttrackCatalogDocDataPointsWorksheetReference,
    fasttrackCatalogDocDataPointsWorksheetName
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
      geography: currentValue.gsx$geography.$t,
      time_unit: currentValue.gsx$timeunit.$t,
      concept_id: currentValue.gsx$conceptid.$t,
      dimensions: currentValue.gsx$dimensions.$t,
      concept_name: currentValue.gsx$conceptname.$t,
      table_format: currentValue.gsx$tableformat.$t,
      csv_link: currentValue.gsx$csvlink.$t,
      doc_id: currentValue.gsx$docid.$t
      /* tslint:enable:object-literal-sort-keys */
    };
  });
  return {
    rows
  };
}

/**
 * @hidden
 */
/*
function fasttrackCatalogDataPointsWorksheetDataToGeoLookupTable(
  data: FasttrackCatalogDataPointsWorksheetData
): FasttrackCatalogDataPointsLookupTable {
  return data.rows.reduce((lookupTableAccumulator, currentValue) => {
    lookupTableAccumulator[currentValue.geo] = currentValue;
    return lookupTableAccumulator;
  }, {});
}
*/
