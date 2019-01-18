/**
 * @hidden
 */
interface WorksheetData {
  rows: {
    [k: string]: string;
  }[];
}

/**
 * @hidden
 */
interface CountriesEtcWorksheetData extends WorksheetData {
  rows: {
    alias: string;
    geo: string;
    name: string;
  }[];
}

/**
 * @hidden
 */
interface GeoLookupTable {
  [alias: string]: {
    geo: string;
    name: string;
  };
}

/**
 * @hidden
 */
function getCountriesEtcLookupTable() {
  // TODO: Be able to reference the name of the worksheet (geoDocWorksheetName)
  /*
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${geoDocSpreadsheetId}/public/values?alt=json`;
  const response = UrlFetchApp.fetch(jsonWorksheetsUrl);
  const obj = JSON.parse(response.getContentText());
  console.log(obj);
  */

  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${geoDocSpreadsheetId}/${geoDocWorksheetReference}/public/values?alt=json`;
  const worksheetDataHTTPResponse = UrlFetchApp.fetch(jsonWorksheetDataUrl);
  const worksheetDataResponse: GsheetsDataApiFeedsListCountriesEtc.Response = JSON.parse(
    worksheetDataHTTPResponse.getContentText()
  );

  const data = gsheetsDataApiFeedsListCountriesEtcResponseToWorksheetData(
    worksheetDataResponse
  );
  return countriesEtcWorksheetDataToGeoLookupTable(data);
}

/**
 * @hidden
 */
function gsheetsDataApiFeedsListCountriesEtcResponseToWorksheetData(
  r: GsheetsDataApiFeedsListCountriesEtc.Response
) {
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
function countriesEtcWorksheetDataToGeoLookupTable(
  data: CountriesEtcWorksheetData
): GeoLookupTable {
  return data.rows.reduce((lookupTableAccumulator, currentValue) => {
    lookupTableAccumulator[currentValue.alias] = {
      geo: currentValue.geo,
      name: currentValue.name
    };
    return lookupTableAccumulator;
  }, {});
}
