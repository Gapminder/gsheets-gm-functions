import { geoSets } from "../gsheetsData/hardcodedConstants";
import { geoSetToFasttrackCatalogGeoSetMap } from "../gsheetsData/hardcodedConstants";

/**
 * Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
 * @hidden
 */
export function validateAndAliasTheGeoSetArgument(geo_set) {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  for (const supportedGeoSet of geoSets) {
    const alias = geoSetToFasttrackCatalogGeoSetMap[supportedGeoSet];
    if (alias && alias === geo_set) {
      return supportedGeoSet;
    }
  }
  if (!geoSets.includes(geo_set)) {
    throw new Error(`Unsupported Gapminder geo_set: "${geo_set}"`);
  }
  return geo_set;
}
