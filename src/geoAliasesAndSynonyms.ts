import { ListGeoAliasesAndSynonyms } from "./gsheetsDataApiFeeds/listGeoAliasesAndSynonyms";
import {
  geoAliasesAndSynonymsDocSpreadsheetId,
  geoAliasesAndSynonymsDocWorksheetReferences
} from "./hardcodedConstants";

/**
 * @hidden
 */
interface GeoAliasesAndSynonymsDataRow {
  /* tslint:disable:object-literal-sort-keys */
  alias: string;
  geo: string;
  name: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
interface GeoAliasesAndSynonymsWorksheetData {
  rows: GeoAliasesAndSynonymsDataRow[];
}

/**
 * @hidden
 */
interface GeoAliasesAndSynonymsLookupTable {
  [alias: string]: GeoAliasesAndSynonymsDataRow;
}

/**
 * @hidden
 */
export function getGeoAliasesAndSynonymsLookupTable(geography) {
  if (!geoAliasesAndSynonymsDocWorksheetReferences[geography]) {
    throw new Error(`Unknown Gapminder geography: "${geography}"`);
  }
  // TODO: Be able to reference the name of the worksheet (geoAliasesAndSynonymsDocWorksheetName)
  /*
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${geoAliasesAndSynonymsDocSpreadsheetId}/public/values?alt=json`;
  const response = UrlFetchApp.fetch(jsonWorksheetsUrl);
  const obj = JSON.parse(response.getContentText());
  console.log(obj);
  */
  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${geoAliasesAndSynonymsDocSpreadsheetId}/${
    geoAliasesAndSynonymsDocWorksheetReferences[geography]
  }/public/values?alt=json`;
  const worksheetDataHTTPResponse = UrlFetchApp.fetch(jsonWorksheetDataUrl);
  const worksheetDataResponse: ListGeoAliasesAndSynonyms.Response = JSON.parse(
    worksheetDataHTTPResponse.getContentText()
  );
  const data = gsheetsDataApiFeedsListGeoAliasesAndSynonymsResponseToWorksheetData(
    worksheetDataResponse
  );
  return geoAliasesAndSynonymsWorksheetDataToGeoLookupTable(data);
}

/**
 * @hidden
 */
function gsheetsDataApiFeedsListGeoAliasesAndSynonymsResponseToWorksheetData(
  r: ListGeoAliasesAndSynonyms.Response
): GeoAliasesAndSynonymsWorksheetData {
  const rows = r.feed.entry.map(currentValue => {
    return {
      /* tslint:disable:object-literal-sort-keys */
      alias: currentValue.gsx$alias.$t,
      geo: currentValue.gsx$geo.$t,
      name: currentValue.gsx$name.$t
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
function geoAliasesAndSynonymsWorksheetDataToGeoLookupTable(
  data: GeoAliasesAndSynonymsWorksheetData
): GeoAliasesAndSynonymsLookupTable {
  return data.rows.reduce((lookupTableAccumulator, currentValue) => {
    lookupTableAccumulator[currentValue.geo] = currentValue;
    lookupTableAccumulator[currentValue.alias] = currentValue;
    return lookupTableAccumulator;
  }, {});
}
