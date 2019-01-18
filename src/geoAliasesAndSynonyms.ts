/**
 * @hidden
 */
const geoAliasesAndSynonymsDocSpreadsheetId =
  "1p7YhbS_f056BUSlJNAm6k6YnNPde8OSdYpJ6YiVHxO4";
/**
 * @hidden
 */
const geoAliasesAndSynonymsDocWorksheetReference = "6";
// Note: Custom functions can not reference named ranges in foreign spreadsheets, but we can reference the name of the worksheet (TODO)
// const geoAliasesAndSynonymsDocWorksheetName = "a-countries-etc";

/**
 * @hidden
 */
interface GeoAliasesAndSynonymsCountriesDataRow {
  alias: string;
  geo: string;
  name: string;
}

/**
 * @hidden
 */
interface GeoAliasesAndSynonymsCountriesEtcWorksheetData {
  rows: GeoAliasesAndSynonymsCountriesDataRow[];
}

/**
 * @hidden
 */
interface GeoAliasesAndSynonymsCountriesEtcLookupTable {
  [alias: string]: GeoAliasesAndSynonymsCountriesDataRow;
}

/**
 * @hidden
 */
function getGeoAliasesAndSynonymsCountriesEtcLookupTable() {
  // TODO: Be able to reference the name of the worksheet (geoAliasesAndSynonymsDocWorksheetName)
  /*
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${geoAliasesAndSynonymsDocSpreadsheetId}/public/values?alt=json`;
  const response = UrlFetchApp.fetch(jsonWorksheetsUrl);
  const obj = JSON.parse(response.getContentText());
  console.log(obj);
  */
  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${geoAliasesAndSynonymsDocSpreadsheetId}/${geoAliasesAndSynonymsDocWorksheetReference}/public/values?alt=json`;
  const worksheetDataHTTPResponse = UrlFetchApp.fetch(jsonWorksheetDataUrl);
  const worksheetDataResponse: GsheetsDataApiFeedsListGeoAliasesAndSynonymsCountriesEtc.Response = JSON.parse(
    worksheetDataHTTPResponse.getContentText()
  );
  const data = gsheetsDataApiFeedsListGeoAliasesAndSynonymsCountriesEtcResponseToWorksheetData(
    worksheetDataResponse
  );
  return geoAliasesAndSynonymsCountriesEtcWorksheetDataToGeoLookupTable(data);
}

/**
 * @hidden
 */
function gsheetsDataApiFeedsListGeoAliasesAndSynonymsCountriesEtcResponseToWorksheetData(
  r: GsheetsDataApiFeedsListGeoAliasesAndSynonymsCountriesEtc.Response
): GeoAliasesAndSynonymsCountriesEtcWorksheetData {
  const rows = r.feed.entry.map(currentValue => {
    return {
      alias: currentValue.gsx$alias.$t,
      geo: currentValue.gsx$geo.$t,
      name: currentValue.gsx$name.$t
    };
  });
  return {
    rows
  };
}

/**
 * @hidden
 */
function geoAliasesAndSynonymsCountriesEtcWorksheetDataToGeoLookupTable(
  data: GeoAliasesAndSynonymsCountriesEtcWorksheetData
): GeoAliasesAndSynonymsCountriesEtcLookupTable {
  return data.rows.reduce((lookupTableAccumulator, currentValue) => {
    lookupTableAccumulator[currentValue.alias] = currentValue;
    return lookupTableAccumulator;
  }, {});
}
