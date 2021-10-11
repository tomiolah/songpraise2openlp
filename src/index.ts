import fs from 'fs';
import path from 'path';
import { Promise as P } from 'bluebird';
import { songToXML } from "./convert";
import { downloadSongpraiseData, getCollectionForSong } from "./downloader";

const outDir = path.join(process.cwd(), 'output');

const rewriteMap: {
  [key: string]: string;
} = {
    'Á': 'A',    'á': 'a',
    'É': 'E',    'é': 'e',
    'Ö': 'O',    'ö': 'o',
    'Ő': 'O',    'ő': 'o',
    'Õ': 'O',    'õ': 'o',
    'Ó': 'O',    'ó': 'o',
    'Ú': 'U',    'ú': 'u',
    'Ü': 'U',    'ü': 'u',
    'Ű': 'U',    'ű': 'u',
    'Í': 'I',    'í': 'i',
    'Û': 'U',    'û': 'u',
    'Ă': 'A',    'ă': 'a',
    'Â': 'A',    'â': 'a',
    'Î': 'I',    'î': 'i',
    'Ț': 'T',    'ț': 't',
    'Ș': 'S',    'ș': 's',
    ' ': '_','. ': '_',
    '/': '_', '_-_': '_',
    ' - ': '_', '_->_': '_',
    ' -> ': '_', '__': '_',
    '_+_': '_', ' + ': '_',
    ',': '',  '.': '', ':': '', 
    '!': '', '?': '', '\'': '', 
    '"': '', '@': '',  '\\': '',
    '#': '',  '&': '', '*': '',
    '%': '', '^': '',  '$': '',
    '(': '',  ')': '', '„': '',
    '”': '', '“': '', ';': '',
};

downloadSongpraiseData().then(async (songs) =>
  P.map(songs, async (value) => {
    console.log(`Getting collection for ${value.title}`);
    return {
      song: value,
      collections: await getCollectionForSong(value.uuid),
    };
  }, { concurrency: 3 })
).then((res) => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  const map = Object.entries(rewriteMap);
  res.map(({ song: s, collections }) => {
    console.log(`Processing song ${s.title}${collections ? 'with' : 'without'} colelction data.`);
    return {
      title: map.reduce(
        (p, c) => {
          const re = new RegExp(c[0].replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
          return p.replace(re, c[1]);
        },
        `${
          collections
          && collections.length > 0
          && collections[0]
          && collections[0].songCollectionElements
          && collections[0].songCollectionElements.length > 0
          && collections[0].songCollectionElements[0]
          && collections[0].songCollectionElements[0].ordinalNumber
          ? `${collections[0].songCollectionElements[0].ordinalNumber}. `
          : ''
        }${s.title}`
      ).replace('__', '_'),
      data: songToXML(s, collections && collections.length > 0 ? collections[0] : undefined).printNode({
        indent: 0,
        newLines: false,
        shortHand: true,
        indentIncrement: 0,
      })
    };
  }).forEach(v => {
    fs.writeFileSync(path.join(outDir, `${v.title}.xml`), v.data);
    console.log(`Wrote ${v.title}.xml`)
  });
});
