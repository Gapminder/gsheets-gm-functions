import { fetchWorksheetData } from "./gsheetsData/fetchWorksheetData";
import { ListGeoAliasesAndSynonyms } from "./gsheetsDataApiFeeds/listGeoAliasesAndSynonyms";
import {
  geoAliasesAndSynonymsDocSpreadsheetId,
  geoAliasesAndSynonymsDocWorksheetNames,
  geoAliasesAndSynonymsDocWorksheetReferences
} from "./hardcodedConstants";

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
export function getGeoAliasesAndSynonymsLookupTable(geography) {
  if (!geoAliasesAndSynonymsDocWorksheetReferences[geography]) {
    throw new Error(`Unknown Gapminder geography: "${geography}"`);
  }
  const worksheetDataResponse: ListGeoAliasesAndSynonyms.Response = fetchWorksheetData(
    geoAliasesAndSynonymsDocSpreadsheetId,
    geoAliasesAndSynonymsDocWorksheetReferences[geography],
    geoAliasesAndSynonymsDocWorksheetNames[geography]
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
  r: ListGeoAliasesAndSynonyms.Response
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
