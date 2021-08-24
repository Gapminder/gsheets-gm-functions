/**
 * Currently concept data rows are treated as having a single indicator (a single value column)
 * TODO: Support multiple indicators in the same concept data row
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
  headers: string[];
  rows: ConceptDataRow[];
}
