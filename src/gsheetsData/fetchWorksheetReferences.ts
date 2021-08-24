import { fetchGoogleSpreadsheetResource } from "../lib/fetchGoogleSpreadsheetResource";
import {
  GSHEETS_GM_FUNCTIONS_API_KEY,
  WorksheetReference
} from "./hardcodedConstants";

/**
 * @hidden
 */
interface SheetInfo {
  properties: {
    sheetId: number;
    title: string;
    index: number;
    sheetType: string;
    gridProperties: {
      rowCount: number;
      columnCount: number;
      frozenRowCount: number;
    };
  };
}

/**
 * @hidden
 */
interface SheetsPropertiesResponse {
  sheets: SheetInfo[];
}

/**
 * @hidden
 */
export function fetchWorksheetReferences(spreadsheetId): WorksheetReference[] {
  const jsonWorksheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties&alt=json&key=${GSHEETS_GM_FUNCTIONS_API_KEY}`;
  const worksheetsResponse = fetchGoogleSpreadsheetResource(
    jsonWorksheetsUrl
  ) as SheetsPropertiesResponse;
  return worksheetsResponse.sheets.map((worksheetInfo, index) => {
    return {
      name: worksheetInfo.properties.title,
      position: index + 1
    };
  });
}
