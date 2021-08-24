import { validateAndAliasTheGeoSetArgument } from "../lib/validateAndAliasTheGeoSetArgument";
import { fetchWorksheetData, WorksheetData } from "./fetchWorksheetData";
import {
  dataGeographiesDocListOfCountriesEtcWorksheetReference,
  dataGeographiesDocSpreadsheetId,
  hardcodedGeoNamesLookupTables
} from "./hardcodedConstants";
import { sanityCheckHeaders } from "./sanityCheckHeaders";

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
  const worksheetDataResponse = fetchWorksheetData(
    dataGeographiesDocSpreadsheetId,
    dataGeographiesDocListOfCountriesEtcWorksheetReference
  );
  const data = gsheetsWorksheetDataToDataGeographiesListOfCountriesEtcWorksheetData(
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
function gsheetsWorksheetDataToDataGeographiesListOfCountriesEtcWorksheetData(
  worksheetData: WorksheetData
): DataGeographiesListOfCountriesEtcWorksheetData {
  // Separate the header row from the data rows
  const headers = worksheetData.values.shift();
  // Sanity check headers
  const expectedHeaders = [
    "geo",
    "name",
    "four_regions",
    "eight_regions",
    "six_regions",
    "members_oecd_g77",
    "Latitude",
    "Longitude",
    "UN member since",
    "World bank region",
    "World bank, 4 income groups 2017",
    "World bank, 3 income groups 2017"
  ];
  sanityCheckHeaders(
    headers,
    expectedHeaders,
    "DataGeographiesListOfCountriesEtcWorksheet"
  );
  // Interpret the data rows based on position
  const rows = worksheetData.values.map(worksheetDataRow => {
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo: worksheetDataRow[0],
      name: worksheetDataRow[1],
      fourregions: worksheetDataRow[2],
      eightregions: worksheetDataRow[3],
      sixregions: worksheetDataRow[4],
      membersoecdg77: worksheetDataRow[5],
      latitude: worksheetDataRow[6],
      longitude: worksheetDataRow[7],
      unmembersince: worksheetDataRow[8],
      worldbankregion: worksheetDataRow[9],
      worldbank4incomegroups2017: worksheetDataRow[10],
      worldbank3incomegroups2017: worksheetDataRow[11]
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
