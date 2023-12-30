import { collectionNumber } from '../util';
import type { IConverter } from './converters.types';

export const PlaintextConverter: IConverter = {
  getFilename: (title) => `${title}.txt`,
  convertSong: ({ song, collection }) => {
    const title = `${collectionNumber(collection ? [collection] : undefined)}${song.title}`;
    const verses = song.songVerseDTOS.map((verse) => verse.text).join('\n\n');
    return `${title}\n\n${verses}\n`;
  },
};
