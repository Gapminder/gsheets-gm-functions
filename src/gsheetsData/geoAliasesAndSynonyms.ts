import { fetchWorksheetData } from "./fetchWorksheetData";
import {
  geoAliasesAndSynonymsDocSpreadsheetId,
  geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet
} from "./hardcodedConstants";
import { keyNormalizerForSlightlyFuzzyLookups } from "./keyNormalizerForSlightlyFuzzyLookups";
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
  return geoAliasesAndSynonymsWorksheetDataToNormalizedGeoAndAliasesLookupTable(
    data,
    null
  );
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
 * @hidden
 */
export function geoAliasesAndSynonymsWorksheetDataToNormalizedGeoAndAliasesLookupTable(
  data: GeoAliasesAndSynonymsWorksheetData,
  normalizer: (lookupKey: string) => string
): GeoAliasesAndSynonymsLookupTable {
  if (!normalizer) {
    normalizer = keyNormalizerForSlightlyFuzzyLookups;
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
      const lookupKey = keyNormalizerForSlightlyFuzzyLookups(alias);
      return lookupTable[lookupKey] ? lookupTable[lookupKey] : { alias };
    }
  );
}
