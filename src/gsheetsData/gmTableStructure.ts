/**
 * @hidden
 */
export interface GmTableRow {
  geo: string;
  name: string;
  time: string | number;
  data: string[];
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
  public static structureRow(row: any[]): GmTableRow {
    return {
      /* tslint:disable:object-literal-sort-keys */
      geo: row[0],
      name: row[1],
      time: row[2],
      data: row.slice(3)
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
}
