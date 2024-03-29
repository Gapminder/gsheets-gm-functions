import {
  FasttrackCatalogDataPointsDataRow,
  FasttrackCatalogDataPointsWorksheetData
} from "./fastttrackCatalog";
import {
  conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit,
  geoSetToFasttrackCatalogGeoSetMap
} from "./hardcodedConstants";

/**
 * @hidden
 */
export function getValidConceptDataFasttrackCatalogEntry(
  concept_id,
  time_unit,
  geo_set,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  const matchingConcept = getMatchingFasttrackCatalogConcept(
    concept_id,
    time_unit,
    geo_set,
    fasttrackCatalogDataPointsWorksheetData
  );
  if (!conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit[geo_set]) {
    throw new Error(`Unsupported Gapminder geo_set: "${geo_set}"`);
  }
  if (
    !conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit[geo_set][time_unit]
  ) {
    throw new Error(
      `Unsupported time_unit for geo_set "${geo_set}": "${time_unit}"`
    );
  }
  const indicatorOrder = parseInt(matchingConcept.indicator_order, 10);
  if (indicatorOrder < 1) {
    throw new Error(
      `The indicator order ("${matchingConcept.indicator_order}") listed in the fasttrack catalog for this concept was empty or less than 1`
    );
  }
  return {
    conceptVersion: matchingConcept.concept_version,
    csvLink: matchingConcept.csv_link,
    docId: matchingConcept.doc_id,
    indicatorOrder,
    worksheetReference:
      conceptDataDocWorksheetReferencesByGeoSetAndTimeUnit[geo_set][time_unit]
  };
}

/**
 * @hidden
 */
function getMatchingFasttrackCatalogConcept(
  concept_id,
  time_unit,
  geo_set,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  if (!geo_set) {
    geo_set = "countries_etc";
  }
  const fasttrackCatalogGeography = geoSetToFasttrackCatalogGeoSetMap[geo_set];
  const matchingConcepts = fasttrackCatalogDataPointsWorksheetData.rows.filter(
    (row: FasttrackCatalogDataPointsDataRow) => {
      return (
        row.concept_id === concept_id &&
        row.time_unit === time_unit &&
        row.geo_set === fasttrackCatalogGeography
      );
    }
  );
  if (matchingConcepts.length === 0) {
    throw new Error(
      `No concept matches concept_id "${concept_id}", time_unit "${time_unit}", fasttrackCatalogGeography "${fasttrackCatalogGeography}" in the fasttrack catalog`
    );
  }
  if (matchingConcepts.length > 1) {
    throw new Error(
      `More than one concept matches concept_id "${concept_id}", time_unit "${time_unit}", fasttrackCatalogGeography "${fasttrackCatalogGeography}" in the fasttrack catalog`
    );
  }
  return matchingConcepts[0];
}
