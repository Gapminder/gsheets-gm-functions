/* tslint:disable:interface-name */
/* tslint:disable:no-namespace */
export namespace ListDataGeographiesListOfCountriesEtc {
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

  export interface GsxGeo {
    $t: string;
  }

  export interface GsxName {
    $t: string;
  }

  export interface GsxFourregions {
    $t: string;
  }

  export interface GsxEightregions {
    $t: string;
  }

  export interface GsxSixregions {
    $t: string;
  }

  export interface GsxMembersoecdg77 {
    $t: string;
  }

  export interface GsxLatitude {
    $t: string;
  }

  export interface GsxLongitude {
    $t: string;
  }

  export interface GsxUnmembersince {
    $t: string;
  }

  export interface GsxWorldbankregion {
    $t: string;
  }

  export interface GsxWorldbank4incomegroups2017 {
    $t: string;
  }

  export interface GsxWorldbank3incomegroups2017 {
    $t: string;
  }

  export interface Entry {
    id: Id2;
    updated: Updated2;
    category: Category2[];
    title: Title2;
    content: Content;
    link: Link2[];
    gsx$geo: GsxGeo;
    gsx$name: GsxName;
    gsx$fourregions: GsxFourregions;
    gsx$eightregions: GsxEightregions;
    gsx$sixregions: GsxSixregions;
    gsx$membersoecdg77: GsxMembersoecdg77;
    gsx$latitude: GsxLatitude;
    gsx$longitude: GsxLongitude;
    gsx$unmembersince: GsxUnmembersince;
    gsx$worldbankregion: GsxWorldbankregion;
    gsx$worldbank4incomegroups2017: GsxWorldbank3incomegroups2017;
    gsx$worldbank3incomegroups2017: GsxWorldbank4incomegroups2017;
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
