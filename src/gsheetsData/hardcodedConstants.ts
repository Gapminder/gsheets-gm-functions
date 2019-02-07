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
export const gapminderPropertyToConceptIdMap = {
  four_regions: "world_4region"
};

/**
 * @hidden
 */
export const geoAliasesAndSynonymsDocSpreadsheetId =
  "1p7YhbS_f056BUSlJNAm6k6YnNPde8OSdYpJ6YiVHxO4";
/**
 * @hidden
 */
export const geoAliasesAndSynonymsDocWorksheetReferencesByGeopgraphy: {
  [geography: string]: WorksheetReference;
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
export const geographyToFasttrackCatalogGeographyMap = {
  global: "world",
  world_4region: "regions",
  countries_etc: "countries-etc"
};

/**
 * @hidden
 */
export const conceptDataDocWorksheetReferencesByGeographyAndTimeUnit: {
  [geography: string]: { [time_unit: string]: WorksheetReference };
} = {
  global: {
    year: {
      name: "data-world-by-year",
      position: 4
    }
  },
  world_4region: {
    year: {
      name: "data-regions-by-year",
      position: 3
    }
  },
  countries_etc: {
    year: {
      name: "data-countries-etc-by-year",
      position: 2
    }
  }
};
