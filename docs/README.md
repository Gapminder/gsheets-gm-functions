

## Index

### Functions

* [GM_AGGR](#gm_aggr)
* [GM_DATA](#gm_data)
* [GM_ID](#gm_id)
* [GM_IMPORT](#gm_import)
* [GM_INTERPOLATE](#gm_interpolate)
* [GM_NAME](#gm_name)

---

## Functions

<a id="gm_aggr"></a>

###  GM_AGGR

▸ **GM_AGGR**(table_range_with_headers: *`string`[][]*, aggregation_prop: *`string`*, geography: *`string`*): `any`[][]

*Defined in [GM_AGGR.ts:29](https://github.com/Gapminder/gsheets-gm-functions/blob/5601ca7/src/GM_AGGR.ts#L29)*

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

▸ **GM_DATA**(column_or_table_range_with_headers: *`string`[][]*, property_or_concept_id: *`string`*, geography: *`string`*): `any`[][]

*Defined in [GM_DATA.ts:12](https://github.com/Gapminder/gsheets-gm-functions/blob/5601ca7/src/GM_DATA.ts#L12)*

Inserts a property or concept column, including a header row, with a common Gapminder property or concept matched against the input column/table range.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_or_table_range_with_headers | `string`[][] |  Either a column range (for a property lookup column) or a table range including \[geo,name,time\] (for a concept value lookup) |
| property_or_concept_id | `string` |  Either the property (eg. "UN member since") or concept id (eg. "pop") of which value to look up |
| geography | `string` |  Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |

**Returns:** `any`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_id"></a>

###  GM_ID

▸ **GM_ID**(column_range_with_headers: *`string`[][]*, geography: *`string`*): `string`[][]

*Defined in [GM_ID.ts:11](https://github.com/Gapminder/gsheets-gm-functions/blob/5601ca7/src/GM_ID.ts#L11)*

Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `string`[][] |  \- |
| geography | `string` |  Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_import"></a>

###  GM_IMPORT

▸ **GM_IMPORT**(concept_id: *`string`*, time_unit: *`string`*, geography: *`string`*): `string`[][]

*Defined in [GM_IMPORT.ts:15](https://github.com/Gapminder/gsheets-gm-functions/blob/5601ca7/src/GM_IMPORT.ts#L15)*

Imports a standard Gapminder concept table.

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

*Defined in [GM_INTERPOLATE.ts:24](https://github.com/Gapminder/gsheets-gm-functions/blob/5601ca7/src/GM_INTERPOLATE.ts#L24)*

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

▸ **GM_NAME**(column_range_with_headers: *`string`[][]*, geography: *`string`*): `string`[][]

*Defined in [GM_NAME.ts:11](https://github.com/Gapminder/gsheets-gm-functions/blob/5601ca7/src/GM_NAME.ts#L11)*

Inserts a matching column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM\_ID but inserts Gapminder’s common name for the geo instead of its id.)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `string`[][] |  \- |
| geography | `string` |  Should be one of the sets listed in the gapminder geo ontology such as "countries\_etc" |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___

