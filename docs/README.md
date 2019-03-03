

## Index

### Functions

* [GM_AGGR](#gm_aggr)
* [GM_DATA](#gm_data)
* [GM_GROWTH](#gm_growth)
* [GM_ID](#gm_id)
* [GM_IMPORT](#gm_import)
* [GM_INTERPOLATE](#gm_interpolate)
* [GM_NAME](#gm_name)
* [GM_PER_CAP](#gm_per_cap)
* [GM_UNPIVOT](#gm_unpivot)

---

## Functions

<a id="gm_aggr"></a>

###  GM_AGGR

▸ **GM_AGGR**(table_range_with_headers: *`string`[][]*, aggregation_prop: *`string`*, geography: *`string`*): `any`[][]

*Defined in [GM_AGGR.ts:29](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_AGGR.ts#L29)*

Aggregates an input table by property and time, returning a table with the aggregated values of the input table.

The range must be four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be aggregated

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| table_range_with_headers | `string`[][] |  \- |
| aggregation_prop | `string` |  Aggregation property |
| geography | `string` |  Should be one of the sets listed in the gapminder geo ontology such as “countries\_etc” |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_data"></a>

###  GM_DATA

▸ **GM_DATA**(column_or_table_range_with_headers: *`string`[][]*, property_or_concept_id: *`string`*, time_unit: *`string`*, geography: *`string`*, property_or_concept_data_table_range_with_headers: *`string`[][]*): `any`[][]

*Defined in [GM_DATA.ts:24](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_DATA.ts#L24)*

Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.

Note that using a range from a locally imported data dependency is the only performant way to join concept data in a spreadsheet.

Takes 10-20 seconds: =GM\_DATA(B7:D, "pop")

Takes 2-4 seconds: =GM\_DATA(B7:D, "pop", "year", "countries\_etc", 'data:pop:year:countries\_etc'!A1:D)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_or_table_range_with_headers | `string`[][] |  Either a column range (for a property lookup column) or a table range including \[geo,name,time\] (for a concept value lookup) |
| property_or_concept_id | `string` |  Either the property (eg. "UN member since") or concept id (eg. "pop") of which value to look up |
| time_unit | `string` |  (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against |
| geography | `string` |  (Optional with default "countries\_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |
| property_or_concept_data_table_range_with_headers | `string`[][] |  (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the property or concept data to look up against. Can be included for performance reasons. |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_growth"></a>

###  GM_GROWTH

▸ **GM_GROWTH**(table_range_with_headers: *`string`[][]*, concept_id: *`string`*, time_unit: *`string`*, geography: *`string`*, concept_data_table_range_with_headers: *`string`[][]*): `string`[][]

*Defined in [GM_GROWTH.ts:19](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_GROWTH.ts#L19)*

Inserts the growth per time unit of a common Gapminder concept column, including a header row, matched against the input table range.

Note: Uses GM\_DATA internally. Performance-related documentation about GM\_DATA applies.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| table_range_with_headers | `string`[][] |  A table range including \[geo,name,time\] to be used for a concept value lookup |
| concept_id | `string` |  Concept id (eg. "pop") of which concept to import |
| time_unit | `string` |  (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against |
| geography | `string` |  (Optional with default "countries\_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |
| concept_data_table_range_with_headers | `string`[][] |  (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the concept data to look up against. Can be included for performance reasons. |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_id"></a>

###  GM_ID

▸ **GM_ID**(column_range_with_headers: *`string`[][]*, geography: *`string`*, verbose: *`boolean`*): `string`[][]

*Defined in [GM_ID.ts:12](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_ID.ts#L12)*

Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `string`[][] |  \- |
| geography | `string` |  Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |
| verbose | `boolean` |  Explains how a certain row is invalid instead of simply returning "\[Invalid\]" for the row |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_import"></a>

###  GM_IMPORT

▸ **GM_IMPORT**(concept_id: *`string`*, time_unit: *`string`*, geography: *`string`*): `string`[][]

*Defined in [GM_IMPORT.ts:29](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_IMPORT.ts#L29)*

Imports a standard Gapminder concept table.

Note that using data dependencies in combination with the QUERY() function instead of GM\_IMPORT() is the only performant way to include concept data in a spreadsheet.

Takes 2-4 seconds: =GM\_IMPORT("pop", "year", "global")

Almost instant: =QUERY('data:pop:year:global'!A1:D)

Always yields "Error: Result too large" since the "countries\_etc" version of the dataset is rather large: =GM\_IMPORT("pop", "year", "countries\_etc")

Finishes in 3-10 seconds: =QUERY('data:pop:year:countries\_etc'!A1:D)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| concept_id | `string` |  Concept id (eg. "pop") of which concept to import |
| time_unit | `string` |  Time unit variant (eg. "year") of the concept to import |
| geography | `string` |  Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_interpolate"></a>

###  GM_INTERPOLATE

▸ **GM_INTERPOLATE**(table_range_with_headers: *`string`[][]*, method: *`string`*): `any`[][]

*Defined in [GM_INTERPOLATE.ts:24](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_INTERPOLATE.ts#L24)*

Interpolates an input table, inserting a sorted table with additional rows, where the gaps (missing rows or empty values) in the input table have been filled in. This function works on data with two primary key columns: usually geo and time. (If we want to use this on data that has more keys: geo, time, age, gender, etc - we need a different formula)

The range must be four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be interpolated

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| table_range_with_headers | `string`[][] |  \- |
| method | `string` |  Optional. linear (default), growth, flat\_forward, flat\_backward |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_name"></a>

###  GM_NAME

▸ **GM_NAME**(column_range_with_headers: *`string`[][]*, geography: *`string`*, verbose: *`boolean`*): `string`[][]

*Defined in [GM_NAME.ts:12](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_NAME.ts#L12)*

Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM\_ID but inserts Gapminder’s common name for the geo instead of its id.)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `string`[][] |  \- |
| geography | `string` |  Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |
| verbose | `boolean` |  Explains how a certain row is invalid instead of simply returning "\[Invalid\]" for the row |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_per_cap"></a>

###  GM_PER_CAP

▸ **GM_PER_CAP**(table_range_with_headers_and_concept_values: *`string`[][]*, time_unit: *`string`*, geography: *`string`*, population_concept_data_table_range_with_headers: *`string`[][]*): `string`[][]

*Defined in [GM_PER_CAP.ts:18](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_PER_CAP.ts#L18)*

Divides the concept-value column(s) of the input table range by the population of the geography.

Note: Uses GM\_DATA internally. Performance-related documentation about GM\_DATA applies.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| table_range_with_headers_and_concept_values | `string`[][] |  A table range including \[geo,name,time,concept-values...\] |
| time_unit | `string` |  (Optional with default "year") Time unit variant (eg. "year") of the concept to look up against |
| geography | `string` |  (Optional with default "countries\_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |
| population_concept_data_table_range_with_headers | `string`[][] |  (Optional with defaulting to importing the corresponding data on-the-fly) Local spreadsheet range of the population concept data to look up against. Can be included for performance reasons. |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_unpivot"></a>

###  GM_UNPIVOT

▸ **GM_UNPIVOT**(table_range_with_headers: *`string`[][]*, time_label: *`string`*, value_label: *`string`*): `string`[][]

*Defined in [GM_UNPIVOT.ts:16](https://github.com/Gapminder/gsheets-gm-functions/blob/4ce2e8d/src/GM_UNPIVOT.ts#L16)*

Unpivots a standard pivoted Gapminder table \[geo, name, ...time-values-across-columns\], converting the data column headers into time units and the column values as concept values.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| table_range_with_headers | `string`[][] |  The table range to unpivot |
| time_label | `string` |  (Optional with default "time") the header label to use for the time column |
| value_label | `string` |  (Optional with default "value") the header label to use for the value column |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___

