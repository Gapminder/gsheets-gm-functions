/**
 * @hidden
 */
const dataGeographiesDocSpreadsheetId =
  "1AljtXKMAxzTmxH2ukZrpuuTEGoiKu75LIjFMRj4lxN8";
// TODO: Update to below once the data has been published (above is a published copy of the official document)
// const dataGeographiesDocSpreadsheetId = "1qHalit8sXC0R8oVXibc2wa2gY7bkwGzOybEMTWp-08o";
/**
 * @hidden
 */
const dataGeographiesDocWorksheetReference = "2";
// Note: Custom functions can not reference named ranges in foreign spreadsheets, but we can reference the name of the worksheet (TODO)
// const geoDocWorksheetName = "list-of-countries-etc";

/**
 * @hidden
 */
interface DataGeographiesListOfCountriesEtcDataRow {
  /* tslint:disable:object-literal-sort-keys */
  geo: string;
  name: string;
  fourregions: string;
  eightregions: string;
  sixregions: string;
  membersoecdg77: string;
  latitude: string;
  longitude: string;
  unmembersince: string;
  worldbankregion: string;
  worldbankincomegroup2017: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
interface DataGeographiesListOfCountriesEtcWorksheetData {
  rows: DataGeographiesListOfCountriesEtcDataRow[];
}

/**
 * @hidden
 */
interface DataGeographiesListOfCountriesEtcLookupTable {
  [alias: string]: DataGeographiesListOfCountriesEtcDataRow;
}

/**
 * @hidden
 */
export function getDataGeographiesListOfCountriesEtcLookupTable() {
  // TODO: Be able to reference the name of the worksheet (geoAliasesAndSynonymsDocWorksheetName)
  /*
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${geoAliasesAndSynonymsDocSpreadsheetId}/public/values?alt=json`;
  const response = UrlFetchApp.fetch(jsonWorksheetsUrl);
  const obj = JSON.parse(response.getContentText());
  console.log(obj);
  */
  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${dataGeographiesDocSpreadsheetId}/${dataGeographiesDocWorksheetReference}/public/values?alt=json`;
  const worksheetDataHTTPResponse = UrlFetchApp.fetch(jsonWorksheetDataUrl);
  const worksheetDataResponse: GsheetsDataApiFeedsListDataGeographiesListOfCountriesEtc.Response = JSON.parse(
    worksheetDataHTTPResponse.getContentText()
  );
  const data = gsheetsDataApiFeedsListDataGeographiesListOfCountriesEtcResponseToWorksheetData(
    worksheetDataResponse
  );
  return dataGeographiesListOfCountriesEtcWorksheetDataToGeoLookupTable(data);
}

/**
 * @hidden
 */
function gsheetsDataApiFeedsListDataGeographiesListOfCountriesEtcResponseToWorksheetData(
  r: GsheetsDataApiFeedsListDataGeographiesListOfCountriesEtc.Response
): DataGeographiesListOfCountriesEtcWorksheetData {
  const rows = r.feed.entry.map(currentValue => {
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo: currentValue.gsx$geo.$t,
      name: currentValue.gsx$name.$t,
      fourregions: currentValue.gsx$fourregions.$t,
      eightregions: currentValue.gsx$eightregions.$t,
      sixregions: currentValue.gsx$sixregions.$t,
      membersoecdg77: currentValue.gsx$membersoecdg77.$t,
      latitude: currentValue.gsx$latitude.$t,
      longitude: currentValue.gsx$longitude.$t,
      unmembersince: currentValue.gsx$unmembersince.$t,
      worldbankregion: currentValue.gsx$worldbankregion.$t,
      worldbankincomegroup2017: currentValue.gsx$worldbankincomegroup2017.$t
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
function dataGeographiesListOfCountriesEtcWorksheetDataToGeoLookupTable(
  data: DataGeographiesListOfCountriesEtcWorksheetData
): DataGeographiesListOfCountriesEtcLookupTable {
  return data.rows.reduce((lookupTableAccumulator, currentValue) => {
    lookupTableAccumulator[currentValue.geo] = currentValue;
    return lookupTableAccumulator;
  }, {});
}
