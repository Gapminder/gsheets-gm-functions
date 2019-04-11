import { fetchGoogleSpreadsheetResource } from "../lib/fetchGoogleSpreadsheetResource";
import { WorksheetReference } from "./hardcodedConstants";

/**
 * @hidden
 */
export function fetchWorksheetReferences(spreadsheetId): WorksheetReference[] {
  const jsonWorksheetsUrl = `https://spreadsheets.google.com/feeds/worksheets/${spreadsheetId}/public/values?alt=json`;
  const worksheetsResponse = fetchGoogleSpreadsheetResource(jsonWorksheetsUrl);
  return worksheetsResponse.feed.entry.map((worksheetEntry, index) => {
    return {
      name: worksheetEntry.title.$t,
      position: index + 1
      /*
        stats: {
          colCount: worksheetEntry["gs$colCount"].$t,
          rowCount: worksheetEntry["gs$rowCount"].$t
        }
        */
    };
  });
}
