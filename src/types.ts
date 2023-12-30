export type Song = {
  title: string;
  songVerseDTOS: Verse[];
  publish: boolean;
  published: boolean;
  uuid: string;
  createdDate: string;
  modifiedDate: string;
  versionGroup: undefined | string;
};

export type Verse = {
  uuid: undefined;
  text: string;
  chorus: boolean;
  secondText: undefined | string;
};

export type ISongCollection = {
  uuid: string;
  createdDate: number;
  modifiedDate: number;
  songCollectionElements: ISongCollectionElement[];
  name: string;
  languageUuid: string;
};

export type ISongCollectionElement = {
  ordinalNumber: string;
  songUuid: string;
};

export enum ConversionTargets {
  OpenLyricsXML = 'open-lyrics',
  PlainText = 'plaintext',
}
