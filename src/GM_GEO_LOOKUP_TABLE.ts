import {
  GeoAliasesAndSynonymsDataRow,
  GeoAliasesAndSynonymsLookupTable,
  GeoAliasesAndSynonymsWorksheetData,
  geoAliasesAndSynonymsWorksheetDataToGeoLookupTable,
  getGeoAliasesAndSynonymsWorksheetData
} from "./gsheetsData/geoAliasesAndSynonyms";
import { validateAndAliasTheGeoSetArgument } from "./lib/validateAndAliasTheGeoSetArgument";

/**
 * Inserts a table with Gapminder’s geo ids together with their aliases (all spellings we have seen before), including lower cased
 * variants without diacritics and special characters to allow for somewhat fuzzy matching.
 *
 * To be used as the source range for VLOOKUP where the dataset is too large for GM_ID or GM_NAME to be used directly.
 *
 * @param geo_set (Optional with default "countries_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_GEO_LOOKUP_TABLE(geo_set: string): string[][] {
  // Validate and accept alternate geo set references (countries-etc, regions, world) for the geo_set argument
  validateAndAliasTheGeoSetArgument(geo_set);

  const geoAliasesAndSynonymsWorksheetData: GeoAliasesAndSynonymsWorksheetData = getGeoAliasesAndSynonymsWorksheetData(
    geo_set
  );
  const fuzzyMatchLookupTable: GeoAliasesAndSynonymsLookupTable = geoAliasesAndSynonymsWorksheetDataToGeoLookupTable(
    geoAliasesAndSynonymsWorksheetData,
    null
  );
  const exactMatchLookupTable: GeoAliasesAndSynonymsLookupTable = geoAliasesAndSynonymsWorksheetDataToGeoLookupTable(
    geoAliasesAndSynonymsWorksheetData,
    lookupKey => lookupKey
  );
  const lookupTable = { ...fuzzyMatchLookupTable, ...exactMatchLookupTable };
  const lookupKeys = Object.keys(lookupTable);
  const lookupTableOutput = lookupKeys.map(lookupKey => {
    const geoAliasesAndSynonymsDataRow: GeoAliasesAndSynonymsDataRow =
      lookupTable[lookupKey];
    return [
      lookupKey,
      geoAliasesAndSynonymsDataRow.geo,
      geoAliasesAndSynonymsDataRow.name
    ];
  });
  const sortedLookupTableOutput = lookupTableOutput.sort((a, b) => {
    const geoIdComparison = a[1].localeCompare(b[1], "en", {
      sensitivity: "accent"
    });
    const aliasComparison = a[0].localeCompare(b[0], "en", {
      sensitivity: "accent"
    });
    if (geoIdComparison === 0) {
      return aliasComparison;
    }
    return geoIdComparison;
  });
  return [["alias", "geo", "name"]].concat(sortedLookupTableOutput);
}
