/**
 * @hidden
 */
export interface OpenNumbersDatasetConceptListingDataRow {
  /* tslint:disable:object-literal-sort-keys */
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
export function getOpenNumbersDatasetConceptListing(repository) {
  const openNumbersDatasetConceptListingCsvHTTPResponse = UrlFetchApp.fetch(
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

  if (JSON.stringify(expectedHeaders) !== JSON.stringify(headers)) {
    throw new Error(
      `The open-numbers catalog list csv headers are expected to be ${JSON.stringify(
        expectedHeaders
      )} but are currently ${JSON.stringify(
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
        geo_set: "geo",
        time_unit: "year",
        concept_id,
        concept_name,
        csv_link: `https://raw.githubusercontent.com/open-numbers/${repository}/master/ddf--datapoints--${concept_id}--by--geo--time.csv`
        /* tslint:enable:object-literal-sort-keys */
      };
    }
  );
}
