import { validateAndAliasTheGeoSetArgument } from "../lib/validateAndAliasTheGeoSetArgument";
import { fetchWorksheetData } from "./fetchWorksheetData";
import {
  dataGeographiesDocListOfCountriesEtcWorksheetReference,
  dataGeographiesDocSpreadsheetId,
  hardcodedGeoNamesLookupTables
} from "./hardcodedConstants";
import { ListDataGeographiesListOfCountriesEtc } from "./types/listDataGeographiesListOfCountriesEtc";

/**
 * @hidden
 */
export interface DataGeographiesGeoNameDataRow {
  /* tslint:disable:object-literal-sort-keys */
  geo: string;
  name: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
interface DataGeographiesListOfCountriesEtcDataRow
  extends DataGeographiesGeoNameDataRow {
  /* tslint:disable:object-literal-sort-keys */
  fourregions: string;
  eightregions: string;
  sixregions: string;
  membersoecdg77: string;
  latitude: string;
  longitude: string;
  unmembersince: string;
  worldbankregion: string;
  worldbank4incomegroups2017: string;
  worldbank3incomegroups2017: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
interface DataGeographiesListOfCountriesEtcWorksheetData {
  rows: DataGeographiesListOfCountriesEtcDataRow[];
}

/**
 * @hidden
 */
interface DataGeographiesListOfCountriesEtcLookupTable {
  [geo: string]: DataGeographiesListOfCountriesEtcDataRow;
}

/**
 * @hidden
 */
export interface DataGeographiesGeoNameLookupTable {
  [geo: string]: DataGeographiesGeoNameDataRow;
}

/**
 * @hidden
 */
export function getDataGeographiesListOfCountriesEtcLookupTable() {
  const worksheetDataResponse: ListDataGeographiesListOfCountriesEtc.Response = fetchWorksheetData(
    dataGeographiesDocSpreadsheetId,
    dataGeographiesDocListOfCountriesEtcWorksheetReference
  );
  const data = gsheetsDataApiFeedsListDataGeographiesListOfCountriesEtcResponseToWorksheetData(
    worksheetDataResponse
  );
  return dataGeographiesListOfCountriesEtcWorksheetDataToGeoLookupTable(data);
}

/**
 * @hidden
 */
export function getDataGeographiesGeoNamesLookupTable(
  geo_set: string
): DataGeographiesGeoNameLookupTable {
  const validatedGeoSetArgument = validateAndAliasTheGeoSetArgument(geo_set);
  switch (geo_set) {
    case "countries_etc":
      return getDataGeographiesListOfCountriesEtcLookupTable();
    case "world_4region":
    case "world_6region":
    case "global":
      return hardcodedGeoNamesLookupTables[geo_set];
    default:
      throw new Error("Invalid geo set: " + geo_set);
  }
}

/**
 * @hidden
 */
function gsheetsDataApiFeedsListDataGeographiesListOfCountriesEtcResponseToWorksheetData(
  r: ListDataGeographiesListOfCountriesEtc.Response
): DataGeographiesListOfCountriesEtcWorksheetData {
  const checkAttr = (
    entry: ListDataGeographiesListOfCountriesEtc.Entry,
    attribute
  ) => {
    if (!entry["gsx$" + attribute]) {
      throw new Error(
        `Found no attribute "${attribute}" in the Data Geographies list-of-countries-etc sheet's data feed. Has the column been removed/renamed?`
      );
    }
  };
  const rows = r.feed.entry.map(currentValue => {
    // Runtime sanity check since type definitions may be outdated compared to the actual feed data
    [
      "geo",
      "name",
      "fourregions",
      "eightregions",
      "sixregions",
      "membersoecdg77",
      "latitude",
      "longitude",
      "unmembersince",
      "worldbankregion",
      "worldbank4incomegroups2017",
      "worldbank3incomegroups2017"
    ].map(attribute => {
      checkAttr(currentValue, attribute);
    });
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo: currentValue.gsx$geo.$t,
      name: currentValue.gsx$name.$t,
      fourregions: currentValue.gsx$fourregions.$t,
      eightregions: currentValue.gsx$eightregions.$t,
      sixregions: currentValue.gsx$sixregions.$t,
      membersoecdg77: currentValue.gsx$membersoecdg77.$t,
      latitude: currentValue.gsx$latitude.$t,
      longitude: currentValue.gsx$longitude.$t,
      unmembersince: currentValue.gsx$unmembersince.$t,
      worldbankregion: currentValue.gsx$worldbankregion.$t,
      worldbank4incomegroups2017:
        currentValue.gsx$worldbank4incomegroups2017.$t,
      worldbank3incomegroups2017: currentValue.gsx$worldbank3incomegroups2017.$t
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
function dataGeographiesListOfCountriesEtcWorksheetDataToGeoLookupTable(
  data: DataGeographiesListOfCountriesEtcWorksheetData
): DataGeographiesListOfCountriesEtcLookupTable {
  return data.rows.reduce(
    (
      lookupTableAccumulator,
      currentValue: DataGeographiesListOfCountriesEtcDataRow
    ) => {
      lookupTableAccumulator[currentValue.geo] = currentValue;
      return lookupTableAccumulator;
    },
    {}
  );
}
