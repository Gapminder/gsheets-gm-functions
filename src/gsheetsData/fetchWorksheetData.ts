/**
 * @hidden
 */
export function fetchWorksheetData(
  spreadsheetId,
  worksheetPosition,
  worksheetName
) {
  // TODO: Be able to reference the name of the worksheet (geoAliasesAndSynonymsDocWorksheetName)
  /*
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${spreadsheetId}/public/values?alt=json`;
  const response = UrlFetchApp.fetch(jsonWorksheetsUrl);
  const obj = JSON.parse(response.getContentText());
  console.log(obj);
  */
  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/${worksheetPosition}/public/values?alt=json`;
  const worksheetDataHTTPResponse = UrlFetchApp.fetch(jsonWorksheetDataUrl);
  const worksheetDataResponse = JSON.parse(
    worksheetDataHTTPResponse.getContentText()
  );
  const fetchedWorksheetName = worksheetDataResponse.feed.title.$t;
  if (fetchedWorksheetName !== worksheetName) {
    throw new Error(
      `Unexpected worksheet name "${fetchedWorksheetName}". The "${worksheetName}" worksheet must be in position ${worksheetPosition} in spreadsheet with id ${spreadsheetId}`
    );
  }
  return worksheetDataResponse;
}
