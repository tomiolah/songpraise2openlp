export type Song = {
  title: string;
  verses: Verse[];
  publish: boolean;
  published: boolean;
  uuid: string;
  createdDate: string;
  modifiedDate: string;
  versionGroup: null | string;
};

export type Verse = {
  uuid: null;
  text: string;
  chorus: boolean;
  secondText: null | string;
};

export interface ISongCollection {
  uuid:                   string;
  createdDate:            number;
  modifiedDate:           number;
  songCollectionElements: ISongCollectionElement[];
  name:                   string;
  languageUuid:           string;
}

export interface ISongCollectionElement {
  ordinalNumber: string;
  songUuid:      string;
}
