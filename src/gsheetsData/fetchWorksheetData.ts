import { WorksheetReference } from "./hardcodedConstants";

/**
 * @hidden
 */
export function fetchWorksheetData(
  spreadsheetId,
  worksheetReference: WorksheetReference
) {
  // TODO: Be able to reference the name of the worksheet
  /*
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${spreadsheetId}/public/values?alt=json`;
  const response = UrlFetchApp.fetch(jsonWorksheetsUrl);
  const obj = JSON.parse(response.getContentText());
  console.log(obj);
  */
  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/${
    worksheetReference.position
  }/public/values?alt=json`;
  const worksheetDataHTTPResponse = UrlFetchApp.fetch(jsonWorksheetDataUrl);
  const worksheetDataResponse = JSON.parse(
    worksheetDataHTTPResponse.getContentText()
  );
  const fetchedWorksheetName = worksheetDataResponse.feed.title.$t;
  if (fetchedWorksheetName !== worksheetReference.name) {
    throw new Error(
      `Unexpected worksheet name "${fetchedWorksheetName}". The "${
        worksheetReference.name
      }" worksheet must be in position ${
        worksheetReference.position
      } in spreadsheet with id ${spreadsheetId}`
    );
  }
  return worksheetDataResponse;
}
