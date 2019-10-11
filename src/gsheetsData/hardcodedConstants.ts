/**
 * This file contains hard coded sheet ids, worksheet ids and other
 * mappings that must be reflected by the underlying source data
 */
/* tslint:disable:object-literal-sort-keys */

/**
 * These are the geo sets recognized/supported currently
 * @hidden
 */
export const geoSets = [
  "global",
  "world_4region",
  "world_6region",
  "countries_etc",
  "4ilevels"
];

/**
 * @hidden
 */
export const hardcodedGeoNamesLookupTables = {
  world_4region: {
    // From the Data Geographies spreadsheet
    asia: {
      geo: "asia",
      name: "Asia"
    },
    europe: {
      geo: "europe",
      name: "Europe"
    },
    africa: {
      geo: "africa",
      name: "Africa"
    },
    americas: {
      geo: "americas",
      name: "The Americas"
    }
  },
  // From https://github.com/open-numbers/ddf--gapminder--geo_entity_domain/blob/master/ddf--entities--geo--world_6region.csv
  world_6region: {
    east_asia_pacific: {
      geo: "east_asia_pacific",
      name: "East Asia & Pacific"
    },
    south_asia: {
      geo: "south_asia",
      name: "South Asia"
    },
    middle_east_north_africa: {
      geo: "middle_east_north_africa",
      name: "Middle East & North Africa"
    },
    sub_saharan_africa: {
      geo: "sub_saharan_africa",
      name: "Sub-Saharan Africa"
    },
    america: {
      geo: "america",
      name: "America"
    },
    europe_central_asia: {
      geo: "europe_central_asia",
      name: "Europe & Central Asia"
    }
  },
  // From the Data Geographies spreadsheet
  global: {
    world: {
      geo: "world",
      name: "The World"
    }
  },
  "4ilevels": {
    // From the Data Geographies spreadsheet
    asia: {
      geo: "l1",
      name: "Level 1"
    },
    europe: {
      geo: "l2",
      name: "Level 2"
    },
    africa: {
      geo: "l3",
      name: "Level 3"
    },
    americas: {
      geo: "l4",
      name: "Level 4"
    }
  }
};

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
  },
  "4ilevels": {
    name: "a-4ilevels",
    position: 7
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
  countries_etc: "countries-etc",
  "4ilevels": "income-levels"
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
  },
  "4ilevels": {
    year: {
      name: "data-for-4ilevels-by-year",
      position: 5
    }
  }
};
