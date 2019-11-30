/* tslint:disable:interface-name */
/* tslint:disable:no-namespace */
export namespace ListFasttrackCatalogDataPoints {
  export interface Id {
    $t: string;
  }

  export interface Updated {
    $t: Date;
  }

  export interface Category {
    scheme: string;
    term: string;
  }

  export interface Title {
    type: string;
    $t: string;
  }

  export interface Link {
    rel: string;
    type: string;
    href: string;
  }

  export interface Name {
    $t: string;
  }

  export interface Email {
    $t: string;
  }

  export interface Author {
    name: Name;
    email: Email;
  }

  export interface OpenSearchTotalResults {
    $t: string;
  }

  export interface OpenSearchStartIndex {
    $t: string;
  }

  export interface Id2 {
    $t: string;
  }

  export interface Updated2 {
    $t: Date;
  }

  export interface Category2 {
    scheme: string;
    term: string;
  }

  export interface Title2 {
    type: string;
    $t: string;
  }

  export interface Content {
    type: string;
    $t: string;
  }

  export interface Link2 {
    rel: string;
    type: string;
    href: string;
  }

  export interface GsxDatasetid {
    $t: string;
  }

  export interface GsxIndicatororder {
    $t: string;
  }

  export interface GsxGeography {
    $t: string;
  }

  export interface GsxTimeunit {
    $t: string;
  }

  export interface GsxConceptid {
    $t: string;
  }

  export interface GsxDimensions {
    $t: string;
  }

  export interface GsxConceptname {
    $t: string;
  }

  export interface GsxConceptversion {
    $t: string;
  }

  export interface GsxTableformat {
    $t: string;
  }

  export interface GsxCsvlink {
    $t: string;
  }

  export interface GsxDatabasenamefortime {
    $t: string;
  }

  export interface GsxKey {
    $t: string;
  }

  export interface GsxDocid {
    $t: string;
  }

  export interface GsxDocLink {
    $t: string;
  }

  export interface GsxConceptid2 {
    $t: string;
  }

  export interface GsxNameshort {
    $t: string;
  }

  export interface GsxDatabasenameofgeoset {
    $t: string;
  }

  export interface GsxSheetname {
    $t: string;
  }

  export interface GsxSlicename {
    $t: string;
  }

  export interface GsxIndicatorNameshort {
    $t: string;
  }

  export interface Entry {
    id: Id2;
    updated: Updated2;
    category: Category2[];
    title: Title2;
    content: Content;
    link: Link2[];
    gsx$datasetid: GsxDatasetid;
    gsx$indicatororder: GsxIndicatororder;
    gsx$geography: GsxGeography;
    gsx$timeunit: GsxTimeunit;
    gsx$conceptid: GsxConceptid;
    gsx$dimensions: GsxDimensions;
    gsx$conceptname: GsxConceptname;
    gsx$conceptversion: GsxConceptversion;
    gsx$tableformat: GsxTableformat;
    gsx$csvlink: GsxCsvlink;
    gsx$databasenamefortime: GsxDatabasenamefortime;
    gsx$key: GsxKey;
    gsx$docid: GsxDocid;
    "gsx$doc-link": GsxDocLink;
    gsx$conceptid_2: GsxConceptid2;
    gsx$nameshort: GsxNameshort;
    gsx$databasenameofgeoset: GsxDatabasenameofgeoset;
    gsx$sheetname: GsxSheetname;
    gsx$slicename: GsxSlicename;
    "gsx$indicator-nameshort": GsxIndicatorNameshort;
  }

  export interface Feed {
    xmlns: string;
    xmlns$openSearch: string;
    xmlns$gsx: string;
    id: Id;
    updated: Updated;
    category: Category[];
    title: Title;
    link: Link[];
    author: Author[];
    openSearch$totalResults: OpenSearchTotalResults;
    openSearch$startIndex: OpenSearchStartIndex;
    entry: Entry[];
  }

  export interface Response {
    version: string;
    encoding: string;
    feed: Feed;
  }
}
