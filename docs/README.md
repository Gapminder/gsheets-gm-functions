

## Index

### Functions

* [GM_AGGREGATE](#gm_aggregate)
* [GM_ID](#gm_id)
* [GM_INTERPOLATE](#gm_interpolate)
* [GM_NAME](#gm_name)
* [GM_PROP](#gm_prop)

---

## Functions

<a id="gm_aggregate"></a>

###  GM_AGGREGATE

▸ **GM_AGGREGATE**(table_range_with_headers: *`any`*, geo_set_name: *`any`*): `string`

*Defined in [Code.ts:127](https://github.com/Gapminder/gsheets-gm-functions/blob/1acacfd/Code.ts#L127)*

Aggregates an input table, returning a table with the aggregated values of the input table.

The range must be four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be aggregated
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| table_range_with_headers | `any` |  \- |
| geo_set_name | `any` |  \- |

**Returns:** `string`

___
<a id="gm_id"></a>

###  GM_ID

▸ **GM_ID**(column_range_with_headers: *`any`*, concept_id: *`any`*): `string`

*Defined in [Code.ts:53](https://github.com/Gapminder/gsheets-gm-functions/blob/1acacfd/Code.ts#L53)*

Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `any` |  \- |
| concept_id | `any` |  Should be one of the sets listed in the gapminder geo ontology such as “countries\_etc” (see the tab “geo-sets” in the "geo aliases and synonyms" workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian\_states, us\_states ) TODO: Make optional |

**Returns:** `string`

___
<a id="gm_interpolate"></a>

###  GM_INTERPOLATE

▸ **GM_INTERPOLATE**(table_range_with_headers: *`any`*, method: *`any`*): `string`

*Defined in [Code.ts:99](https://github.com/Gapminder/gsheets-gm-functions/blob/1acacfd/Code.ts#L99)*

Interpolates an input table, inserting a sorted table with additional rows, where the gaps (missing rows or empty values) in the input table have been filled in. This function works on data with two primary key columns: usually geo and time. (If we want to use this on data that has more keys: geo, time, age, gender, etc - we need a different formula)

The range must be four columns wide.

*   Column 1: geo\_ids
*   Column 2: geo\_names (isn’t part of the calculation)
*   Column 3: time
*   Column 4+: values to be interpolated
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| table_range_with_headers | `any` |  \- |
| method | `any` |  Optional. linear, growth, flat\_forward, flat\_backward |

**Returns:** `string`

___
<a id="gm_name"></a>

###  GM_NAME

▸ **GM_NAME**(column_range_with_headers: *`any`*, concept_id: *`any`*): `string`

*Defined in [Code.ts:82](https://github.com/Gapminder/gsheets-gm-functions/blob/1acacfd/Code.ts#L82)*

Inserts a column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM\_ID but inserts Gapminder’s common name for the geo instead of its id.)
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `any` |  \- |
| concept_id | `any` |  Should be one of the sets listed in the gapminder geo ontology such as “countries\_etc” (see the tab “geo-sets” in this workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian\_states, us\_states ) TODO: Make optional |

**Returns:** `string`

___
<a id="gm_prop"></a>

###  GM_PROP

▸ **GM_PROP**(column_range_with_headers: *`any`*, prop: *`any`*): `string`

*Defined in [Code.ts:110](https://github.com/Gapminder/gsheets-gm-functions/blob/1acacfd/Code.ts#L110)*

Inserts a property column, including a header row, with a common Gapminder property matched against the input column range.
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `any` |  \- |
| prop | `any` |  \- |

**Returns:** `string`

___
