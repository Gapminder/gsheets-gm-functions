/**
 * This file contains hard coded sheet ids, worksheet ids and other
 * mappings that must be reflected by the underlying source data
 */
/* tslint:disable:object-literal-sort-keys */

/**
 * @hidden
 */
export interface WorksheetReference {
  name: string;
  position: number;
}

/**
 * @hidden
 */
export const gapminderPropertyToGeoSetMap = {
  four_regions: "world_4region"
};

/**
 * @hidden
 */
export const conceptDatasetTemplateSpreadsheetId =
  "1ObY2k1SDDEwMfeM5jhQW8hIMcEpo8Oo0qclLZ3L6ByA";

/**
 * @hidden
 */
export const geoAliasesAndSynonymsDocSpreadsheetId =
  "1p7YhbS_f056BUSlJNAm6k6YnNPde8OSdYpJ6YiVHxO4";

/**
 * @hidden
 */
export const geoAliasesAndSynonymsDocWorksheetReferencesByGeoSet: {
  [geo_set: string]: WorksheetReference;
} = {
  global: {
    name: "a-global",
    position: 4
  },
  world_4region: {
    name: "a-world_4regions",
    position: 5
  },
  countries_etc: {
    name: "a-countries_etc",
    position: 6
  }
};

/**
 * @hidden
 */
export const dataGeographiesDocSpreadsheetId =
  "1qHalit8sXC0R8oVXibc2wa2gY7bkwGzOybEMTWp-08o";
/**
 * @hidden
 */
export const dataGeographiesDocListOfCountriesEtcWorksheetReference: WorksheetReference = {
  name: "list-of-countries-etc",
  position: 2
};

/**
 * @hidden
 */
export const fasttrackCatalogDocSpreadsheetId =
  "1eOl5azDMt5rN04UV7QlYeGnVuYjtLwz_XIbPFkB-Xlo";
/**
 * @hidden
 */
export const fasttrackCatalogDocDataPointsWorksheetReference: WorksheetReference = {
  name: "datapoints",
  position: 4
};
/**
 * @hidden
 */
export const geoSetToFasttrackCatalogGeoSetMap = {
  global: "world",
  world_4region: "regions",
  countries_etc: "countries-etc"
};

/**
 * @hidden
 */
export const conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit: {
  [geo_set: string]: { [time_unit: string]: WorksheetReference };
} = {
  global: {
    year: {
      name: "data-for-world-by-year",
      position: 2
    }
  },
  world_4region: {
    year: {
      name: "data-for-regions-by-year",
      position: 3
    }
  },
  countries_etc: {
    year: {
      name: "data-for-countries-etc-by-year",
      position: 4
    }
  }
};
