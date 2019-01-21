import { GsheetsDataApiFeedsListGeoAliasesAndSynonyms } from "./GsheetsDataApiFeedsListGeoAliasesAndSynonyms";

/**
 * @hidden
 */
const geoAliasesAndSynonymsDocSpreadsheetId =
  "1p7YhbS_f056BUSlJNAm6k6YnNPde8OSdYpJ6YiVHxO4";
/**
 * @hidden
 */
const geoAliasesAndSynonymsDocWorksheetReferences = {
  global: 4,
  world_4region: 5,
  countries_etc: 6
};
// Note: Custom functions can not reference named ranges in foreign spreadsheets, but we can reference the name of the worksheet (TODO)
/*
const geoAliasesAndSynonymsDocWorksheetReferences = {
  "global": "a-global",
  "world_4region": "a-world_4regions",
  "countries_etc": "a-countries_etc",
};
*/

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
export function getGeoAliasesAndSynonymsLookupTable(concept_id) {
  if (!geoAliasesAndSynonymsDocWorksheetReferences[concept_id]) {
    throw new Error(`Unknown Gapminder concept id: "${concept_id}"`);
  }
  // TODO: Be able to reference the name of the worksheet (geoAliasesAndSynonymsDocWorksheetName)
  /*
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${geoAliasesAndSynonymsDocSpreadsheetId}/public/values?alt=json`;
  const response = UrlFetchApp.fetch(jsonWorksheetsUrl);
  const obj = JSON.parse(response.getContentText());
  console.log(obj);
  */
  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${geoAliasesAndSynonymsDocSpreadsheetId}/${
    geoAliasesAndSynonymsDocWorksheetReferences[concept_id]
  }/public/values?alt=json`;
  const worksheetDataHTTPResponse = UrlFetchApp.fetch(jsonWorksheetDataUrl);
  const worksheetDataResponse: GsheetsDataApiFeedsListGeoAliasesAndSynonyms.Response = JSON.parse(
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
  r: GsheetsDataApiFeedsListGeoAliasesAndSynonyms.Response
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
