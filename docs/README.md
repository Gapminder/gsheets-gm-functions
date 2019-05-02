
Gsheets `GM_*` Functions
========================

Gapminder-specific custom functions and related menu item actions for Google Spreadsheets.

## Index

### Functions

* [GM_DATA](#gm_data)
* [GM_DATAPOINT_CATALOG_STATUS](#gm_datapoint_catalog_status)
* [GM_DATA_AGGR](#gm_data_aggr)
* [GM_DATA_SLOW](#gm_data_slow)
* [GM_GEO_LOOKUP_TABLE](#gm_geo_lookup_table)
* [GM_GROWTH](#gm_growth)
* [GM_GROWTH_SLOW](#gm_growth_slow)
* [GM_ID](#gm_id)
* [GM_IMPORT_SLOW](#gm_import_slow)
* [GM_INTERPOLATE](#gm_interpolate)
* [GM_NAME](#gm_name)
* [GM_PER_CAP](#gm_per_cap)
* [GM_PER_CAP_SLOW](#gm_per_cap_slow)
* [GM_PROP](#gm_prop)
* [GM_PROP_AGGR](#gm_prop_aggr)
* [GM_UNPIVOT](#gm_unpivot)
* [GM_WEIGHTED_AVERAGE](#gm_weighted_average)
* [menuRefreshDataCatalog](#menurefreshdatacatalog)
* [menuRefreshDataDependencies](#menurefreshdatadependencies)
* [menuValidateDatasetSpreadsheet](#menuvalidatedatasetspreadsheet)

---

## Functions

<a id="gm_data"></a>

###  GM_DATA

▸ **GM_DATA**(input_table_range_with_headers: *`string`[][]*, concepts_data_table_range_with_headers: *`string`[][]*): `any`[][]

*Defined in [GM_DATA.ts:13](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_DATA.ts#L13)*

Inserts a concept column, including a header row, with a common Gapminder concept matched against the input column/table range.

Note: Requires that the concept data to match against is first imported using the "Gapminder Data -> Import/refresh data dependencies".

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  The input table range including \[geo,name,time\] for a concept value lookup |
| concepts_data_table_range_with_headers | `string`[][] |  Local spreadsheet range (imported using data-dependencies) of the concepts' data to look up against. Required for performance reasons. |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_datapoint_catalog_status"></a>

###  GM_DATAPOINT_CATALOG_STATUS

▸ **GM_DATAPOINT_CATALOG_STATUS**(concept_id_and_catalog_reference: *`string`*, time_unit: *`string`*, geo_set: *`string`*, verbose: *`boolean`*): `string`[][]

*Defined in [GM_DATAPOINT_CATALOG_STATUS.ts:27](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_DATAPOINT_CATALOG_STATUS.ts#L27)*

Checks if the referenced concept data is available remotely for import.

Runs the basic validation checks against the referenced dataset making sure that

*   it is listed in the fasttrack catalog or is part of the Open Numbers World Development Indicators
*   (fasttrack catalog only) the relevant "data-" worksheet in the dataset source document is published

Returns "GOOD" or "BAD" (Or "BAD: What is bad... " if the verbose flag is TRUE).

Note: The function results are not automatically re-evaluated as changes are made to the source documents or the catalog. You can trigger a manual update by deleting the cell and undoing the deletion immediately.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| concept_id_and_catalog_reference | `string` |  The concept id and catalog reference in the form of {concept id}@{catalog} (eg "pop@fasttrack", or "pop@opennumbers") of which concept data to check status for |
| time_unit | `string` |  (Optional with default "year") Time unit variant (eg. "year") of the concept data to check status for |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |
| verbose | `boolean` |  Explains how a certain dataset is invalid instead of simply returning "BAD" for the row |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_data_aggr"></a>

###  GM_DATA_AGGR

▸ **GM_DATA_AGGR**(input_table_range_with_headers: *`string`[][]*, concepts_data_table_range_with_headers: *`string`[][]*): `any`[][]

*Defined in [GM_DATA_AGGR.ts:23](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_DATA_AGGR.ts#L23)*

Aggregates an input table by a time-dependent indicator and time, returning a table with the aggregated values of the input table.

The input table must be at least four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be aggregated

Note: Uses GM\_DATA internally

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  \- |
| concepts_data_table_range_with_headers | `string`[][] |  Local spreadsheet range (imported using data-dependencies) of the concepts' data to look up against. Required for performance reasons. |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_data_slow"></a>

###  GM_DATA_SLOW

▸ **GM_DATA_SLOW**(column_or_table_range_with_headers: *`string`[][]*, concept_id: *`string`*, time_unit: *`string`*, geo_set: *`string`*): `any`[][]

*Defined in [GM_DATA_SLOW.ts:23](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_DATA_SLOW.ts#L23)*

Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.

Imports the corresponding data on-the-fly. Note that using GM\_DATA is the only performant way to join concept data in a spreadsheet.

Takes 10-20 seconds: =GM\_DATA\_SLOW(B7:D, "pop", "year", "countries\_etc")

Takes 2-4 seconds: =GM\_DATA(B7:D, 'data:pop@fasttrack:year:countries\_etc'!A1:D)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_or_table_range_with_headers | `string`[][] |  Either a column range (for a property lookup column) or a table range including \[geo,name,time\] (for a concept value lookup) |
| concept_id | `string` |  The concept id ("pop") of which value to look up |
| time_unit | `string` |  (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_geo_lookup_table"></a>

###  GM_GEO_LOOKUP_TABLE

▸ **GM_GEO_LOOKUP_TABLE**(geo_set: *`string`*): `string`[][]

*Defined in [GM_GEO_LOOKUP_TABLE.ts:19](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_GEO_LOOKUP_TABLE.ts#L19)*

Inserts a table with Gapminder’s geo ids together with their aliases (all spellings we have seen before), including lower cased variants without diacritics and special characters to allow for somewhat fuzzy matching.

To be used as the source range for VLOOKUP where the dataset is too large for GM\_ID or GM\_NAME to be used directly.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_growth"></a>

###  GM_GROWTH

▸ **GM_GROWTH**(input_table_range_with_headers: *`string`[][]*, concepts_data_table_range_with_headers: *`string`[][]*): `string`[][]

*Defined in [GM_GROWTH.ts:14](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_GROWTH.ts#L14)*

Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.

Note: Uses GM\_DATA internally

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  A table range including \[geo,name,time\] to be used for a concept value lookup |
| concepts_data_table_range_with_headers | `string`[][] |  Local spreadsheet range (imported using data-dependencies) of the concepts' data to look up against. Required for performance reasons. |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_growth_slow"></a>

###  GM_GROWTH_SLOW

▸ **GM_GROWTH_SLOW**(input_table_range_with_headers: *`string`[][]*, concept_id: *`string`*, time_unit: *`string`*, geo_set: *`string`*): `string`[][]

*Defined in [GM_GROWTH_SLOW.ts:17](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_GROWTH_SLOW.ts#L17)*

Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.

Note: Uses GM\_DATA\_SLOW internally. Performance-related documentation about GM\_DATA\_SLOW applies.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  A table range including \[geo,name,time\] to be used for a concept value lookup |
| concept_id | `string` |  The concept id ("pop") of which value to look up |
| time_unit | `string` |  (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_id"></a>

###  GM_ID

▸ **GM_ID**(column_range_with_headers: *`string`[][]*, geo_set: *`string`*, verbose: *`boolean`*): `string`[][]

*Defined in [GM_ID.ts:14](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_ID.ts#L14)*

Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geo\_set you want to identify. Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `string`[][] |  \- |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |
| verbose | `boolean` |  (Optional with default "FALSE") Explains how a certain row is invalid instead of simply returning "\[Invalid\]" for the row |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_import_slow"></a>

###  GM_IMPORT_SLOW

▸ **GM_IMPORT_SLOW**(concept_id: *`string`*, time_unit: *`string`*, geo_set: *`string`*): `string`[][]

*Defined in [GM_IMPORT_SLOW.ts:28](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_IMPORT_SLOW.ts#L28)*

Imports a standard Gapminder concept table.

Note that using data dependencies in combination with the QUERY() function instead of GM\_IMPORT\_SLOW() is the only performant way to include concept data in a spreadsheet.

Takes 2-4 seconds: =GM\_IMPORT\_SLOW("pop", "year", "global")

Almost instant: =QUERY('data:pop@fasttrack:year:global'!A1:D)

Always yields "Error: Result too large" since the "countries\_etc" version of the dataset is rather large: =GM\_IMPORT\_SLOW("pop", "year", "countries\_etc")

Finishes in 3-10 seconds: =QUERY('data:pop@fasttrack:year:countries\_etc'!A1:D)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| concept_id | `string` |  Concept id (eg. "pop") of which concept to import |
| time_unit | `string` |  Time unit variant (eg. "year") of the concept to import |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_interpolate"></a>

###  GM_INTERPOLATE

▸ **GM_INTERPOLATE**(input_table_range_with_headers: *`string`[][]*, method: *`string`*): `any`[][]

*Defined in [GM_INTERPOLATE.ts:24](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_INTERPOLATE.ts#L24)*

Interpolates an input table, inserting a sorted table with additional rows, where the gaps (missing rows or empty values) in the input table have been filled in. This function works on data with two primary key columns: usually geo and time. (If we want to use this on data that has more keys: geo, time, age, gender, etc - we need a different formula)

The range must be four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be interpolated

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  \- |
| method | `string` |  Optional. linear (default), growth, flat\_forward, flat\_backward |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_name"></a>

###  GM_NAME

▸ **GM_NAME**(column_range_with_headers: *`string`[][]*, geo_set: *`string`*, verbose: *`boolean`*): `string`[][]

*Defined in [GM_NAME.ts:14](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_NAME.ts#L14)*

Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM\_ID but inserts Gapminder’s common name for the geo instead of its id.) Note: Automatically adds geo ids as aliases in geo lookup tables, so that "USA" matches "usa" even though no specific alias "usa" is mapped to "usa".

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `string`[][] |  \- |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |
| verbose | `boolean` |  (Optional with default "FALSE") Explains how a certain row is invalid instead of simply returning "\[Invalid\]" for the row |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_per_cap"></a>

###  GM_PER_CAP

▸ **GM_PER_CAP**(input_table_range_with_headers_and_concept_values: *`string`[][]*, population_concept_data_table_range_with_headers: *`string`[][]*): `string`[][]

*Defined in [GM_PER_CAP.ts:14](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_PER_CAP.ts#L14)*

Divides the concept-value column(s) of the input table range by the population of the geo\_set.

Note: Uses GM\_DATA internally

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers_and_concept_values | `string`[][] |  A table range including \[geo,name,time,concept-values...\] |
| population_concept_data_table_range_with_headers | `string`[][] |  Local spreadsheet range (imported using data-dependencies) of the population concept data to look up against, where the population concept is the first concept column in the data range. Required for performance reasons. |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_per_cap_slow"></a>

###  GM_PER_CAP_SLOW

▸ **GM_PER_CAP_SLOW**(input_table_range_with_headers_and_concept_values: *`string`[][]*, time_unit: *`string`*, geo_set: *`string`*): `string`[][]

*Defined in [GM_PER_CAP_SLOW.ts:16](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_PER_CAP_SLOW.ts#L16)*

Divides the concept-value column(s) of the input table range by the population of the geo\_set.

Note: Uses GM\_DATA\_SLOW internally. Performance-related documentation about GM\_DATA\_SLOW applies.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers_and_concept_values | `string`[][] |  A table range including \[geo,name,time,concept-values...\] |
| time_unit | `string` |  (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against |
| geo_set | `string` |  (Optional with default "countries\_etc") Should be one of the geo set names listed in the "geo aliases and synonyms" spreadsheet |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_prop"></a>

###  GM_PROP

▸ **GM_PROP**(input_column_range_with_headers: *`string`[][]*, property_id: *`string`*): `any`[][]

*Defined in [GM_PROP.ts:11](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_PROP.ts#L11)*

Inserts a property column, including a header row, with a common Gapminder property matched against the input column/table range.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_column_range_with_headers | `string`[][] |  A column range for a property lookup column |
| property_id | `string` |  The property (eg. "UN member since") to look up |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_prop_aggr"></a>

###  GM_PROP_AGGR

▸ **GM_PROP_AGGR**(input_table_range_with_headers: *`string`[][]*, aggregation_property_id: *`string`*): `any`[][]

*Defined in [GM_PROP_AGGR.ts:23](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_PROP_AGGR.ts#L23)*

Aggregates an input table by a time-independent property and time, returning a table with the aggregated values of the input table.

The input table must be at least four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be aggregated

Note: Uses GM\_PROP internally

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  \- |
| aggregation_property_id | `string` |  Aggregation property |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_unpivot"></a>

###  GM_UNPIVOT

▸ **GM_UNPIVOT**(input_table_range_with_headers: *`string`[][]*, time_label: *`string`*, value_label: *`string`*): `string`[][]

*Defined in [GM_UNPIVOT.ts:16](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_UNPIVOT.ts#L16)*

Unpivots a standard pivoted Gapminder table \[geo, name, ...time-values-across-columns\], converting the data column headers into time units and the column values as concept values.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  The table range to unpivot |
| time_label | `string` |  (Optional with default "time") the header label to use for the time column |
| value_label | `string` |  (Optional with default "value") the header label to use for the value column |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_weighted_average"></a>

###  GM_WEIGHTED_AVERAGE

▸ **GM_WEIGHTED_AVERAGE**(input_table_range_with_headers: *`string`[][]*, aggregation_property_id: *`string`*, population_concept_data_table_range_with_headers: *`string`[][]*): `any`[][]

*Defined in [GM_WEIGHTED_AVERAGE.ts:25](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/GM_WEIGHTED_AVERAGE.ts#L25)*

Aggregates an input table by a time-independent property and time, returning a table with the population-weighted average values of the input table.

The input table must be at least four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be aggregated

Note: Uses GM\_PROP internally for the property lookup, and GM\_DATA internally for the population lookup

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input_table_range_with_headers | `string`[][] |  \- |
| aggregation_property_id | `string` |  Aggregation property |
| population_concept_data_table_range_with_headers | `string`[][] |  Local spreadsheet range (imported using data-dependencies) of the population concept data to look up against, where the population concept is the first concept column in the data range. Required for performance reasons. |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="menurefreshdatacatalog"></a>

###  menuRefreshDataCatalog

▸ **menuRefreshDataCatalog**(): `void`

*Defined in [menuActions/menuRefreshDataCatalog.ts:13](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/menuActions/menuRefreshDataCatalog.ts#L13)*

Menu item action for "Gapminder Data -> Refresh data catalog"

Imports the data catalog from the fasttrack catalog to the current spreadsheet, setting the relevant selectable options in the data-dependencies spreadsheet.

Details:

*   Creates the data-dependencies and data-catalog spreadsheets if they don't exist
*   Verifies that the first headers of the data-dependencies spreadsheet are as expected

**Returns:** `void`

___
<a id="menurefreshdatadependencies"></a>

###  menuRefreshDataDependencies

▸ **menuRefreshDataDependencies**(): `void`

*Defined in [menuActions/menuRefreshDataDependencies.ts:24](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/menuActions/menuRefreshDataDependencies.ts#L24)*

Menu item action for "Gapminder Data -> Import/refresh data dependencies"

Imports data sets from the fasttrack catalog to the current spreadsheet, allowing GM\_-functions to reference local data instead of importing data on-the-fly.

Details:

*   Creates the data-dependencies and data-catalog spreadsheets if they don't exist
*   Verifies that the first headers of the data-dependencies spreadsheet are as expected
*   Does not attempt to import data with bad catalog status
*   Communicates import status as the import progresses

**Returns:** `void`

___
<a id="menuvalidatedatasetspreadsheet"></a>

###  menuValidateDatasetSpreadsheet

▸ **menuValidateDatasetSpreadsheet**(): `void`

*Defined in [menuActions/menuValidateDatasetSpreadsheet.ts:38](https://github.com/Gapminder/gsheets-gm-functions/blob/v0.9.2/src/menuActions/menuValidateDatasetSpreadsheet.ts#L38)*

Menu item action for "Gapminder Data -> Validate this dataset spreadsheet" (only shown if the spreadsheet contains an "ABOUT" sheet and a named range called "dataset\_id")

Validates if the current dataset spreadsheet conforms to the comments found in [the template](https://docs.google.com/spreadsheets/d/1ObY2k1SDDEwMfeM5jhQW8hIMcEpo8Oo0qclLZ3L6ByA/edit) and writes the validation results in the Validation table at the bottom of the About sheet.

Details:

*   Checks the row headers of the output sheets (the so called "data-for-world/region/countries-etc/income-levels-by-year")
*   Checks the about sheet (to see if it follows the requirements in col A in the template)
*   Checks that filter mode is not turned on in output sheets (since it breaks the CSV endpoint)

**Returns:** `void`

___

