/* tslint:disable:interface-name */
/* tslint:disable:no-namespace */
export namespace DocMetadata {
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

  export interface GsxDatageographiesv1 {
    $t: string;
  }

  export interface GsxFreedatafromwwwGapminderOrg {
    $t: string;
  }

  export interface GsxId {
    $t: string;
  }

  export interface GsxVersion {
    $t: string;
  }

  export interface GsxCpzh4 {
    $t: string;
  }

  export interface Entry {
    id: Id2;
    updated: Updated2;
    category: Category2[];
    title: Title2;
    content: Content;
    link: Link2[];
    gsx$datageographiesv1: GsxDatageographiesv1;
    "gsx$freedatafromwww.gapminder.org": GsxFreedatafromwwwGapminderOrg;
    gsx$id: GsxId;
    gsx$version: GsxVersion;
    gsx$_cpzh4: GsxCpzh4;
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
