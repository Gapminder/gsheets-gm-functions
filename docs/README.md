

## Index

### Interfaces

* [CountriesEtcWorksheetData](interfaces/countriesetcworksheetdata.md)
* [GeoLookupTable](interfaces/geolookuptable.md)
* [WorksheetData](interfaces/worksheetdata.md)

### Variables

* [geoDocSpreadsheetId](#geodocspreadsheetid)
* [geoDocWorksheetReference](#geodocworksheetreference)

### Functions

* [GM_AGGREGATE](#gm_aggregate)
* [GM_ID](#gm_id)
* [GM_INTERPOLATE](#gm_interpolate)
* [GM_NAME](#gm_name)
* [GM_PROP](#gm_prop)
* [countriesEtcWorksheetDataToGeoLookupTable](#countriesetcworksheetdatatogeolookuptable)
* [getCountriesEtcLookupTable](#getcountriesetclookuptable)
* [gsheetsDataApiFeedsListCountriesEtcResponseToWorksheetData](#gsheetsdataapifeedslistcountriesetcresponsetoworksheetdata)

---

## Variables

<a id="geodocspreadsheetid"></a>

### `<Const>` geoDocSpreadsheetId

**● geoDocSpreadsheetId**: *"1p7YhbS_f056BUSlJNAm6k6YnNPde8OSdYpJ6YiVHxO4"* = "1p7YhbS_f056BUSlJNAm6k6YnNPde8OSdYpJ6YiVHxO4"

*Defined in [constants.ts:1](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/constants.ts#L1)*

___
<a id="geodocworksheetreference"></a>

### `<Const>` geoDocWorksheetReference

**● geoDocWorksheetReference**: *"6"* = "6"

*Defined in [constants.ts:2](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/constants.ts#L2)*

___

## Functions

<a id="gm_aggregate"></a>

###  GM_AGGREGATE

▸ **GM_AGGREGATE**(table_range_with_headers: *`any`*, geo_set_name: *`any`*): `string`

*Defined in [Code.ts:91](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/Code.ts#L91)*

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
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_id"></a>

###  GM_ID

▸ **GM_ID**(column_range_with_headers: *`any`[][]*, concept_id: *`string`*): `string`[][]

*Defined in [Code.ts:9](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/Code.ts#L9)*

Inserts a matching column, including a header row, with Gapminder’s geo ids matched against the input column range, based on all spellings we have seen before. It should be entered in the header cell under which you want the first first id to appear and it uses as input another range of cells, which should start with the header of the column with names of a geography you want to identify.
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `any`[][] |  \- |
| concept_id | `string` |  Should be one of the sets listed in the gapminder geo ontology such as “countries\_etc” (see the tab “geo-sets” in the "geo aliases and synonyms" workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian\_states, us\_states ) TODO: Make optional |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_interpolate"></a>

###  GM_INTERPOLATE

▸ **GM_INTERPOLATE**(table_range_with_headers: *`any`*, method: *`any`*): `string`

*Defined in [Code.ts:61](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/Code.ts#L61)*

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
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_name"></a>

###  GM_NAME

▸ **GM_NAME**(column_range_with_headers: *`any`*, concept_id: *`any`*): `string`[][]

*Defined in [Code.ts:32](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/Code.ts#L32)*

Inserts a column, including a header row, with Gapminder’s common name for the geo matched against the input column range, based on all spellings we have seen before. (Like GM\_ID but inserts Gapminder’s common name for the geo instead of its id.)
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `any` |  \- |
| concept_id | `any` |  Should be one of the sets listed in the gapminder geo ontology such as “countries\_etc” (see the tab “geo-sets” in this workbook with one sheet for each set of geographies, and for each of them a look up table with aliases). Our plan is to add more known sets of geographies to this workbook (such as indian\_states, us\_states ) TODO: Make optional |

**Returns:** `string`[][]
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="gm_prop"></a>

###  GM_PROP

▸ **GM_PROP**(column_range_with_headers: *`any`*, prop: *`any`*): `string`

*Defined in [Code.ts:73](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/Code.ts#L73)*

Inserts a property column, including a header row, with a common Gapminder property matched against the input column range.
*__customfunction__*: 

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| column_range_with_headers | `any` |  \- |
| prop | `any` |  \- |

**Returns:** `string`
A two-dimensional array containing the cell/column contents described above in the summary.

___
<a id="countriesetcworksheetdatatogeolookuptable"></a>

###  countriesEtcWorksheetDataToGeoLookupTable

▸ **countriesEtcWorksheetDataToGeoLookupTable**(data: *[CountriesEtcWorksheetData](interfaces/countriesetcworksheetdata.md)*): [GeoLookupTable](interfaces/geolookuptable.md)

*Defined in [lib.ts:59](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/lib.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | [CountriesEtcWorksheetData](interfaces/countriesetcworksheetdata.md) |

**Returns:** [GeoLookupTable](interfaces/geolookuptable.md)

___
<a id="getcountriesetclookuptable"></a>

###  getCountriesEtcLookupTable

▸ **getCountriesEtcLookupTable**(): [GeoLookupTable](interfaces/geolookuptable.md)

*Defined in [lib.ts:22](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/lib.ts#L22)*

**Returns:** [GeoLookupTable](interfaces/geolookuptable.md)

___
<a id="gsheetsdataapifeedslistcountriesetcresponsetoworksheetdata"></a>

###  gsheetsDataApiFeedsListCountriesEtcResponseToWorksheetData

▸ **gsheetsDataApiFeedsListCountriesEtcResponseToWorksheetData**(r: *`Response`*): `object`

*Defined in [lib.ts:43](https://github.com/Gapminder/gsheets-gm-functions/blob/c1af676/src/lib.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| r | `Response` |

**Returns:** `object`

___

