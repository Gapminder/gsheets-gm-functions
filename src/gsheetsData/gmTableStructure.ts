/**
 * @hidden
 */
export interface GmTableRow {
  geo: string;
  name: string;
  time: string | number;
  data: string[];
  originalRowIndex?: number;
}

/**
 * @hidden
 */
export interface GmTableRowWithTimesAcrossColumns {
  geo: string;
  name: string;
  timeInColumnsData: string[];
}

/**
 * @hidden
 */
export interface GmTableRowsByGeoAndTime {
  [geo: string]: { [time: string]: GmTableRow };
}

/**
 * @hidden
 */
export class GmTable {
  public static structureRow(row: any[], index): GmTableRow {
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo: row[0],
      name: row[1],
      time: row[2],
      data: row.slice(3),
      originalRowIndex: index
      /* tslint:enable:object-literal-sort-keys */
    };
  }

  public static unstructureRow(structuredRow: GmTableRow): any[] {
    return [
      structuredRow.geo,
      structuredRow.name,
      structuredRow.time,
      ...structuredRow.data
    ];
  }

  public static byGeoAndTime(tableRows): GmTableRowsByGeoAndTime {
    return tableRows.reduce((_, inputTableRow) => {
      if (!_[inputTableRow.geo]) {
        _[inputTableRow.geo] = {};
      }
      _[inputTableRow.geo][inputTableRow.time] = inputTableRow;
      return _;
    }, {});
  }

  public static structureRowWithTimesAcrossColumns(
    row: any[]
  ): GmTableRowWithTimesAcrossColumns {
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo: row[0],
      name: row[1],
      timeInColumnsData: row.slice(2)
      /* tslint:enable:object-literal-sort-keys */
    };
  }

  public static unpivotRowWithTimesAcrossColumns(
    inputTableRow: GmTableRowWithTimesAcrossColumns,
    headerTableRow: GmTableRowWithTimesAcrossColumns
  ): GmTableRow[] {
    return inputTableRow.timeInColumnsData.map(
      (time, index): GmTableRow => {
        return {
          /* tslint:disable:object-literal-sort-keys */
          geo: inputTableRow.geo,
          name: inputTableRow.name,
          time: headerTableRow.timeInColumnsData[index],
          data: [time],
          originalRowIndex: index
          /* tslint:enable:object-literal-sort-keys */
        };
      }
    );
  }
}
