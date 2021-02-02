export type Song = {
  title: string;
  verses: Verse[];
  publish: boolean;
  published: boolean;
  uuid: null | string;
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
