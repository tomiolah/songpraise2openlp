import { OOPXMLNode as XMLNode } from '@tomiolah1998/ts-xml';
import type { ISongCollection, Song } from '../types';
import type { IConverter } from './converters.types';

const songToOpenLyricsXML = (song: Song, collection?: ISongCollection): XMLNode => {
  const root = new XMLNode('song', {
    attributes: {
      xmlns: 'http://openlyrics.info/namespace/2009/song',
      version: '0.9',
    },
  });
  const collectionOrdinalNumber = collection && collection.songCollectionElements.length > 0 ? collection.songCollectionElements[0].ordinalNumber : undefined;
  const songTitle = `${collectionOrdinalNumber ? `${collectionOrdinalNumber}. ` : ''}${song.title}`;
  const properties = new XMLNode('properties', {
    value: [
      new XMLNode('titles').appendValue((
        new XMLNode('title', {value: [songTitle]})
      )),
      ...(
        collection && collectionOrdinalNumber ? [
          new XMLNode('songbooks', {
            value: [
              new XMLNode('songbook', {
                attributes: {
                  name: collection.name,
                  entry: collectionOrdinalNumber,
                },
              }),
            ],
          }),
        ] : []
      ),
    ],
  });

  let verseNo = 1;
  const getVerseNo = () => {
    const temporary = verseNo;
    verseNo += 1;
    return `v${temporary}`;
  };

  let chorusNo = 1;
  const getChorusNo = () => {
    const temporary = chorusNo;
    chorusNo += 1;
    return `c${temporary}`;
  };

  console.log("[DEBUG]", song);
  const lyrics = new XMLNode('lyrics', {
    value: song?.songVerseDTOS?.map(
      v =>
        new XMLNode('verse', {
          attributes: {
            name: (v.chorus ? getChorusNo : getVerseNo)(),
          },
          value: [
            new XMLNode('lines', {
              value: v.text.split('\n').reduce<Array<string | XMLNode>>(
                (p, c, ci) => ci > 0
                  ? [...p, new XMLNode('br'), c]
                  : [...p, c],
                [],
              ),
            }),
          ],
        }),
    ),
  });
  return root.appendValues([properties, lyrics]);
};

export const OpenLyricsXMLConverter: IConverter = {
  convertSong: ({ song, collection }) =>
    songToOpenLyricsXML(song, collection).printNode({
      indent: 0,
      newLines: false,
      shortHand: true,
      indentIncrement: 0,
    }),
  getFilename: (title: string) => `${title}.xml`,
};
