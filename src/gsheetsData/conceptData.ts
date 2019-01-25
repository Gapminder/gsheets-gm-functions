import {
  FasttrackCatalogDataPointsDataRow,
  FasttrackCatalogDataPointsWorksheetData
} from "./fastttrackCatalog";
import { fetchWorksheetData } from "./fetchWorksheetData";
import {
  conceptDataDocWorksheetReferencesByGeographyAndTimeUnit,
  gapminderConceptIdToConceptDataConceptValueColumnHeaderMap,
  geographyToFasttrackCatalogGeographyMap
} from "./hardcodedConstants";
import { listConceptDataByGeographyAndTimeUnit } from "./types/listConceptDataByGeographyAndTimeUnit";
import GsxValue = listConceptDataByGeographyAndTimeUnit.GsxValue;

/**
 * @hidden
 */
export interface ConceptDataRow {
  /* tslint:disable:object-literal-sort-keys */
  geo: string;
  name: string;
  time: string;
  value: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
interface ConceptDataWorksheetData {
  rows: ConceptDataRow[];
}

/**
 * @hidden
 */
export function getConceptDataWorksheetData(
  concept_id,
  time_unit,
  geography,
  fasttrackCatalogDataPointsWorksheetData: FasttrackCatalogDataPointsWorksheetData
) {
  if (!geography) {
    geography = "countries_etc";
  }
  const fasttrackCatalogGeography =
    geographyToFasttrackCatalogGeographyMap[geography];
  const matchingConcepts = fasttrackCatalogDataPointsWorksheetData.rows.filter(
    (row: FasttrackCatalogDataPointsDataRow) => {
      return (
        row.concept_id === concept_id &&
        row.time_unit === time_unit &&
        row.geography === fasttrackCatalogGeography
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
  const matchingConcept = matchingConcepts[0];
  if (!conceptDataDocWorksheetReferencesByGeographyAndTimeUnit[geography]) {
    throw new Error(`Unsupported Gapminder geography: "${geography}"`);
  }
  if (
    !conceptDataDocWorksheetReferencesByGeographyAndTimeUnit[geography][
      time_unit
    ]
  ) {
    throw new Error(
      `Unsupported time_unit for geography "${geography}": "${time_unit}"`
    );
  }
  const conceptDataDocWorksheetReference =
    conceptDataDocWorksheetReferencesByGeographyAndTimeUnit[geography][
      time_unit
    ];
  const conceptDataDocSpreadsheetId = matchingConcept.doc_id;
  const worksheetDataResponse: listConceptDataByGeographyAndTimeUnit.Response = fetchWorksheetData(
    conceptDataDocSpreadsheetId,
    conceptDataDocWorksheetReference
  );
  return listConceptDataByGeographyAndTimeUnitResponseToWorksheetData(
    worksheetDataResponse,
    concept_id
  );
}

/**
 * @hidden
 */
function listConceptDataByGeographyAndTimeUnitResponseToWorksheetData(
  r: listConceptDataByGeographyAndTimeUnit.Response,
  concept_id: string
): ConceptDataWorksheetData {
  const dataConceptValueColumnHeader =
    gapminderConceptIdToConceptDataConceptValueColumnHeaderMap[concept_id];
  const rows = r.feed.entry.map(currentValue => {
    const gsxValue: GsxValue =
      currentValue["gsx$" + dataConceptValueColumnHeader];
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo: currentValue.gsx$geo.$t,
      name: currentValue.gsx$name.$t,
      time:
        currentValue.gsx$time !== undefined
          ? currentValue.gsx$time.$t
          : currentValue.gsx$year.$t,
      value:
        gsxValue !== undefined
          ? gsxValue.$t
          : `Missing value column header "${dataConceptValueColumnHeader}"`
      /* tslint:enable:object-literal-sort-keys */
    };
  });
  return {
    rows
  };
}
