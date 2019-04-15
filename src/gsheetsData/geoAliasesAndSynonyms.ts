import { remove as removeDiacritics } from "diacritics";
import { fetchWorksheetData } from "./fetchWorksheetData";
import {
  geoAliasesAndSynonymsDocSpreadsheetId,
  geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet
} from "./hardcodedConstants";
import { ListGeoAliasesAndSynonyms } from "./types/listGeoAliasesAndSynonyms";

/**
 * @hidden
 */
export interface GeoAliasesAndSynonymsDataRow {
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
export interface GeoAliasesAndSynonymsWorksheetData {
  rows: GeoAliasesAndSynonymsDataRow[];
}

/**
 * @hidden
 */
export interface GeoAliasesAndSynonymsLookupTable {
  [alias: string]: GeoAliasesAndSynonymsDataRow;
}

/**
 * @hidden
 */
export function getGeoAliasesAndSynonymsLookupTable(geo_set) {
  const data = getGeoAliasesAndSynonymsWorksheetData(geo_set);
  return geoAliasesAndSynonymsWorksheetDataToGeoLookupTable(data, null);
}

/**
 * @hidden
 */
export function getGeoAliasesAndSynonymsWorksheetData(geo_set) {
  if (!geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet[geo_set]) {
    throw new Error(`Unknown Gapminder geo_set: "${geo_set}"`);
  }
  const worksheetDataResponse: ListGeoAliasesAndSynonyms.Response = fetchWorksheetData(
    geoAliasesAndSynonymsDocSpreadsheetId,
    geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet[geo_set]
  );
  return gsheetsDataApiFeedsListGeoAliasesAndSynonymsResponseToWorksheetData(
    worksheetDataResponse
  );
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
 * By trimming the lookup keys, we allow slightly fuzzy matching, such as "Foo " == "foo" and "Fóo*" == "Foo"
 * @hidden
 */
export function keyNormalizerForSlightlySmarterLookups(
  lookupKey: string
): string {
  const trimmedLowerCasedWithoutDiacritics = removeDiacritics(
    lookupKey.trim().toLowerCase()
  );
  return trimmedLowerCasedWithoutDiacritics.replace(/[^a-z0-9 ()]/g, "");
}

/**
 * @hidden
 */
export function geoAliasesAndSynonymsWorksheetDataToGeoLookupTable(
  data: GeoAliasesAndSynonymsWorksheetData,
  normalizer: (lookupKey: string) => string
): GeoAliasesAndSynonymsLookupTable {
  if (!normalizer) {
    normalizer = keyNormalizerForSlightlySmarterLookups;
  }
  return data.rows.reduce((lookupTableAccumulator, currentValue) => {
    lookupTableAccumulator[normalizer(currentValue.geo)] = currentValue;
    lookupTableAccumulator[normalizer(currentValue.alias)] = currentValue;
    return lookupTableAccumulator;
  }, {});
}

/**
 * @hidden
 */
export function matchColumnValuesUsingGeoAliasesAndSynonyms(
  columnValues,
  geo_set
) {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  const lookupTable = getGeoAliasesAndSynonymsLookupTable(geo_set);
  return columnValues.map(
    (inputRow): GeoAliasesAndSynonymsDataRow | MissingGeoAliasDataRow => {
      const alias = inputRow[0];
      const lookupKey = keyNormalizerForSlightlySmarterLookups(alias);
      return lookupTable[lookupKey] ? lookupTable[lookupKey] : { alias };
    }
  );
}
