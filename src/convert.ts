import { OOPXMLNode as XMLNode } from '@tomiolah1998/ts-xml';
import { Song } from "./types";

export const songToXML = (song: Song): XMLNode => {
  const root = new XMLNode('song', {
    attributes: {
      xmlns: "http://openlyrics.info/namespace/2009/song",
      version: "0.9",
    }
  });
  const properties = new XMLNode('properties', {
    value: [
      new XMLNode('titles').appendValue((
        new XMLNode('title', { value: [song.title] })
      ))
    ]
  });

  let verseNo = 1;
  const getVerseNo = () => {
    const temp = verseNo;
    verseNo = verseNo + 1;
    return `v${temp}`;
  }

  let chorusNo = 1;
  const getChorusNo = () => {
    const temp = chorusNo;
    chorusNo = chorusNo + 1;
    return `c${temp}`;
  }

  const lyrics = new XMLNode('lyrics', {
    value: song.verses.map(
      v => 
        new XMLNode('verse', {
          attributes: {
            name: (v.chorus ? getChorusNo : getVerseNo)(),
          },
          value: [
            new XMLNode('lines', {
              value: v.text.split('\n').reduce(
                (p, c, ci) => ci > 0
                  ? [ ...p, new XMLNode('br'), c ]
                  : [...p, c],
                [] as (string | XMLNode)[]
              ),
            }),
          ],
        })
    ),
  });
  return root.appendValues([properties, lyrics]);
}