/**
 * This file is built and pushed to Google Scripts using the source code and tools at https://github.com/Gapminder/gsheets-gm-functions
 * Note: Global functions must be exposed to the (global as any) object, or it will not be picked up by gas-webpack-plugin.
 */

import { GM_AGGR } from "./GM_AGGR";
import { GM_DATA } from "./GM_DATA";
import { GM_ID } from "./GM_ID";
import { GM_IMPORT } from "./GM_IMPORT";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";
import { GM_NAME } from "./GM_NAME";
import { GM_UNPIVOT } from "./GM_UNPIVOT";
import { getConceptDataWorksheetMetadata } from "./gsheetsData/conceptData";
import { getFasttrackCatalogDataPointsList } from "./gsheetsData/fastttrackCatalog";

/* tslint:disable:only-arrow-functions */

// Configure custom menus

(global as any).onOpen = function onOpen() {
  console.log("onOpen runs");
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Gapminder Data");
  menu.addItem(
    `Import/refresh data dependencies`,
    "menuRefreshDataDependencies"
  );
  menu.addToUi();
};

(global as any).menuRefreshDataDependencies = function menuImportDataDependencies() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "data-dependencies"
  );

  if (sheet === null) {
    SpreadsheetApp.getUi().alert(
      "No sheet named 'data-dependencies'. Please add one"
    );
    return;
  }

  const dataDependenciesRangeValues = sheet.getDataRange().getValues();

  // For each data dependency - copy the catalog data worksheet values to corresponding sheets in the current spreadsheet
  dataDependenciesRangeValues.shift();
  dataDependenciesRangeValues.map(dataDependencyRow => {
    const concept_id = dataDependencyRow[0];
    const time_unit = dataDependencyRow[1];
    const geography = dataDependencyRow[2];

    const fasttrackCatalogDataPointsWorksheetData = getFasttrackCatalogDataPointsList();

    const conceptDataWorksheetMetadata = getConceptDataWorksheetMetadata(
      concept_id,
      time_unit,
      geography,
      fasttrackCatalogDataPointsWorksheetData
    );

    const destinationSheetName = `data:${concept_id}:${time_unit}:${geography}`;

    // Import sheet from source document
    const sourceDoc = SpreadsheetApp.openById(
      conceptDataWorksheetMetadata.docId
    );
    const sourceSheet = sourceDoc.getSheetByName(
      conceptDataWorksheetMetadata.worksheetReference.name
    );

    // Make sure that the destination sheet exists
    const destination = SpreadsheetApp.getActiveSpreadsheet();
    let destinationSheet = destination.getSheetByName(destinationSheetName);
    if (!destinationSheet) {
      destinationSheet = destination.insertSheet(
        destinationSheetName,
        destination.getNumSheets()
      );
    }

    // Remove existing imported data before import (we keep only 1x1 cell)
    destinationSheet.deleteColumns(1, destinationSheet.getMaxColumns() - 1);
    destinationSheet.deleteRows(1, destinationSheet.getMaxRows() - 1);

    // Import values
    const importValues = sourceSheet.getDataRange().getValues();
    destinationSheet.insertRows(1, importValues.length - 1);
    destinationSheet.insertColumns(1, importValues[0].length - 1);
    destinationSheet
      .getRange(
        1,
        1,
        destinationSheet.getMaxRows(),
        destinationSheet.getMaxColumns()
      )
      .setValues(importValues);
  });

  SpreadsheetApp.getUi().alert("Imported/refreshed data dependencies");

  return;
};

// Expose custom functions
//
// Note: The jsdoc below is manually curated based on the master
// versions in GM_*.ts to enable autocompletion and docs within the spreadsheet
// Differences between ordinary jsdoc and gsheets jsdoc are accounted for:
// 1. The @return statement is ignored by gsheets jsdoc and is thus omitted below
// 2. The parameter type declarations are actually the example usage strings in gsheets
//    jsdoc rather than actual type declarations
// 3. Gsheets jsdoc requires @customfunction to be present

/**
 * Aggregates an input table by id and time, returning a table with the aggregated values of the input table.
 *
 * The range must be four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be aggregated
 *
 * @param {A1:A1000} table_range_with_headers
 * @param {"four_regions"} aggregation_prop Aggregation property
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as “countries_etc”
 * @customfunction
 */
(global as any).GM_AGGR = function(
  table_range_with_headers: string[][],
  aggregation_prop: string,
  geography: string
) {
  return GM_AGGR(table_range_with_headers, aggregation_prop, geography);
};

/**
 * Inserts a property column, including a header row, with a common Gapminder property matched against the input column range.
 *
 * Note that using a range from a locally imported data dependency is the only performant way to join concept data in a spreadsheet.
 *
 * Takes 10-20 seconds:
 * =GM_DATA(B7:D, "pop")
 *
 * Takes 2-4 seconds:
 * =GM_DATA(B7:D, "pop", "year", "countries_etc", 'data:pop:year:countries_etc'!A1:D)
 *
 * @param {A1:D} column_or_table_range_with_headers Either a column range (for a property lookup column) or a table range including [geo,name,time] (for a concept value lookup)
 * @param {"UN members since"} property_or_concept_id Either the property ("UN member since") or concept id ("pop") of which value to look up
 * @param {"year"} time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against
 * @param {"countries_etc"} geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param {'data:pop:year:countries_etc'!A1:D} property_or_concept_data_table_range_with_headers (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the concept data to look up against. Can be included for performance reasons.
 * @customfunction
 */
(global as any).GM_DATA = function(
  column_or_table_range_with_headers: string[][],
  property_or_concept_id: string,
  time_unit: string,
  geography: string,
  property_or_concept_data_table_range_with_headers: string[][]
) {
  return GM_DATA(
    column_or_table_range_with_headers,
    property_or_concept_id,
    time_unit,
    geography,
    property_or_concept_data_table_range_with_headers
  );
};

/**
 * Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @customfunction
 */
(global as any).GM_ID = function(
  column_range_with_headers: string[][],
  geography: string
) {
  return GM_ID(column_range_with_headers, geography);
};

/**
 * Imports a standard Gapminder concept table.
 *
 * Note that using data dependencies in combination with the QUERY() function instead of GM_IMPORT() is the only performant way to include concept data in a spreadsheet.
 *
 * Takes 2-4 seconds:
 * =GM_IMPORT("pop", "year", "global")
 *
 * Almost instant:
 * =QUERY('data:pop:year:global'!A1:D)
 *
 * Always yields "Error: Result too large" since the "countries_etc" version of the dataset is rather large:
 * =GM_IMPORT("pop", "year", "countries_etc")
 *
 * Finishes in 3-10 seconds:
 * =QUERY('data:pop:year:countries_etc'!A1:D)
 *
 * @param {"pop"} concept_id Concept id (eg. "pop") of which concept to import
 * @param {"year"} time_unit Time unit variant (eg. "year") of the concept to import
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
(global as any).GM_IMPORT = function(
  concept_id: string,
  time_unit: string,
  geography: string
) {
  return GM_IMPORT(concept_id, time_unit, geography);
};

/**
 * Interpolates an input table, inserting a sorted table with additional rows, where the gaps (missing rows or empty values) in the input table have been filled in. This function works on data with two primary key columns: usually geo and time. (If we want to use this on data that has more keys: geo, time, age, gender, etc - we need a different formula)
 *
 * The range must be four columns wide.
 *  - Column 1: geo_ids
 *  - Column 2: geo_names (isn’t part of the calculation)
 *  - Column 3: time
 *  - Column 4+: values to be interpolated
 *
 * @param {A1:A1000} table_range_with_headers
 * @param {"linear"} method Optional. linear (default), growth, flat_forward, flat_backward
 * @customfunction
 */
(global as any).GM_INTERPOLATE = function(
  table_range_with_headers: string[][],
  method: string
) {
  return GM_INTERPOLATE(table_range_with_headers, method);
};

/**
 * Inserts a column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM_ID but inserts Gapminder’s common name for the geo instead of its id.)
 *
 * @param {A1:A1000} column_range_with_headers
 * @param {"countries_etc"} geography Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @customfunction
 */
(global as any).GM_NAME = function(
  column_range_with_headers: string[][],
  geography: string
) {
  return GM_NAME(column_range_with_headers, geography);
};

/**
 * Unpivots a standard pivoted Gapminder table [geo, name, ...time-values-across-columns], converting the data column headers into time units and the column values as concept values.
 *
 * @param {A1:A1000} table_range_with_headers The table range to unpivot
 * @param {"year"} time_label (Optional with default "time") the header label to use for the time column
 * @param {"Income level"} value_label (Optional with default "value") the header label to use for the value column
 * @customfunction
 */
(global as any).GM_UNPIVOT = function(
  table_range_with_headers: string[][],
  time_label: string,
  value_label: string
) {
  return GM_UNPIVOT(table_range_with_headers, time_label, value_label);
};
