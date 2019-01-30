import { fetchWorksheetData } from "./fetchWorksheetData";
import {
  geoAliasesAndSynonymsDocSpreadsheetId,
  geoAliasesAndSynonymsDocWorksheetReferencesByGeopgraphy
} from "./hardcodedConstants";
import { ListGeoAliasesAndSynonyms } from "./types/listGeoAliasesAndSynonyms";

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
interface MissingGeoAliasDataRow {
  alias: string;
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
  if (!geoAliasesAndSynonymsDocWorksheetReferencesByGeopgraphy[geography]) {
    throw new Error(`Unknown Gapminder geography: "${geography}"`);
  }
  const worksheetDataResponse: ListGeoAliasesAndSynonyms.Response = fetchWorksheetData(
    geoAliasesAndSynonymsDocSpreadsheetId,
    geoAliasesAndSynonymsDocWorksheetReferencesByGeopgraphy[geography]
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

/**
 * @hidden
 */
export function matchColumnValuesUsingGeoAliasesAndSynonyms(
  columnValues,
  geography
) {
  const lookupTable = getGeoAliasesAndSynonymsLookupTable(geography);
  return columnValues.map(
    (inputRow): GeoAliasesAndSynonymsDataRow | MissingGeoAliasDataRow => {
      const alias = inputRow[0];
      return lookupTable[alias] ? lookupTable[alias] : { alias };
    }
  );
}
