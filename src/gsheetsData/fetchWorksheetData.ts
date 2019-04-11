import { fetchGoogleSpreadsheetResource } from "../lib/fetchGoogleSpreadsheetResource";
import { WorksheetReference } from "./hardcodedConstants";

/**
 * TODO: Be able to reference the name of the worksheet
 * @hidden
 */
export function fetchWorksheetData(
  spreadsheetId,
  worksheetReference: WorksheetReference
) {
  const jsonWorksheetDataUrl = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/${
    worksheetReference.position
  }/public/values?alt=json`;
  const worksheetDataResponse = fetchGoogleSpreadsheetResource(
    jsonWorksheetDataUrl
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
