import { errorHandlingFetch } from "../lib/errorHandlingFetch";

/**
 * @hidden
 */
export interface OpenNumbersDatasetConceptListingDataRow {
  /* tslint:disable:object-literal-sort-keys */
  dataset_id: string;
  geo_set: string;
  time_unit: string;
  concept_id: string;
  concept_name: string;
  csv_link: string;
  /* tslint:enable:object-literal-sort-keys */
}

/**
 * @hidden
 */
export interface OpenNumbersDatasetConceptListing {
  rows: OpenNumbersDatasetConceptListingDataRow[];
}

/**
 * @hidden
 */
interface OpenNumbersDatasetDataPointsLookupTable {
  [alias: string]: OpenNumbersDatasetConceptListingDataRow;
}

/**
 * @hidden
 */
export function getOpenNumbersDatasetConceptListing(
  repository
): OpenNumbersDatasetConceptListingDataRow[] {
  // TODO: Update this to query datapackage.json instead
  const openNumbersDatasetConceptListingCsvHTTPResponse = errorHandlingFetch(
    `https://raw.githubusercontent.com/open-numbers/${repository}/master/ddf--concepts--continuous.csv`
  );
  const openNumbersDatasetConceptListingParsedCsv = Utilities.parseCsv(
    openNumbersDatasetConceptListingCsvHTTPResponse.getContentText()
  );
  return openNumbersDatasetConceptListingParsedCsvToOpenNumbersDatasetConceptListing(
    repository,
    openNumbersDatasetConceptListingParsedCsv
  );
}

/**
 * @hidden
 */
function openNumbersDatasetConceptListingParsedCsvToOpenNumbersDatasetConceptListing(
  repository: string,
  openNumbersDatasetConceptListingParsedCsv: string[][]
): OpenNumbersDatasetConceptListingDataRow[] {
  const expectedHeaders = [
    "concept",
    "aggregation_method",
    "base_period",
    "concept_type",
    "development_relevance",
    "general_comments",
    "license_type",
    "limitations_and_exceptions",
    "long_definition",
    "name",
    "notes_from_original_source",
    "other_notes",
    "periodicity",
    "related_indicators",
    "related_source_links",
    "series_code",
    "short_definition",
    "source",
    "statistical_concept_and_methodology",
    "tags",
    "topic",
    "unit_of_measure"
  ];
  const headers = openNumbersDatasetConceptListingParsedCsv[0];

  if (
    expectedHeaders.indexOf("concept") < 0 ||
    expectedHeaders.indexOf("name") < 0
  ) {
    throw new Error(
      `The open-numbers catalog list csv headers are expected to contain "concept" and "name" but are currently ${JSON.stringify(
        headers
      )}. Please update the GM scripts to expect the current format.`
    );
  }

  const ensuredColumnIndex = (header: string) => {
    const index = expectedHeaders.indexOf(header);
    if (index < 0) {
      throw new Error(`Header not found: '${header}'`);
    }
    return index;
  };

  const parsedCsvRows = openNumbersDatasetConceptListingParsedCsv.slice(1);
  return parsedCsvRows.map(
    (parsedCsvRow): OpenNumbersDatasetConceptListingDataRow => {
      const concept_id = parsedCsvRow[ensuredColumnIndex("concept")];
      const concept_name = parsedCsvRow[ensuredColumnIndex("name")];
      return {
        /* tslint:disable:object-literal-sort-keys */
        dataset_id: concept_id,
        geo_set: "geo",
        time_unit: "year",
        concept_id,
        concept_name,
        // Note: Paths to the actual csvs may change on a whim and be different across datasets
        // TODO: Use the dataset repo's datapackage.json instead of concept listing csv to access the correct path
        csv_link: `https://raw.githubusercontent.com/open-numbers/${repository}/master/datapoints/ddf--datapoints--${concept_id}--by--geo--time.csv`
        /* tslint:enable:object-literal-sort-keys */
      };
    }
  );
}
