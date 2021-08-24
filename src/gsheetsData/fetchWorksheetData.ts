import { fetchGoogleSpreadsheetResource } from "../lib/fetchGoogleSpreadsheetResource";
import {
  GSHEETS_GM_FUNCTIONS_API_KEY,
  WorksheetReference
} from "./hardcodedConstants";

/**
 * @hidden
 */
export interface WorksheetData {
  range: string;
  majorDimension: string;
  values: string[][];
}

/**
 * TODO: Be able to reference the name of the worksheet
 * @hidden
 */
export function fetchWorksheetData(
  spreadsheetId,
  worksheetReference: WorksheetReference
): WorksheetData {
  const jsonWorksheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${worksheetReference.name}?alt=json&key=${GSHEETS_GM_FUNCTIONS_API_KEY}`;
  const worksheetDataResponse = fetchGoogleSpreadsheetResource(
    jsonWorksheetDataUrl
  );
  return worksheetDataResponse;
}
