import type { ISongCollection, Song } from '../types';

export type ConversionFunction = (args: { song: Song; collection?: ISongCollection }) => string;

export interface IConverter {
  convertSong: ConversionFunction;
  getFilename: (title: string) => string;
}
