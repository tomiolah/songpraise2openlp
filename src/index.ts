import fs from 'fs';
import path from 'path';
import { songToXML } from "./convert";
import { downloadSongpraiseData } from "./downloader";

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

downloadSongpraiseData().then(v => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  const map = Object.entries(rewriteMap);
  const songs = v.map(s => ({
    title: map.reduce(
      (p, c) => {
        const re = new RegExp(c[0].replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
        return p.replace(re, c[1]);
      },
      s.title
    ).replace('__', '_'),
    data: songToXML(s).printNode({
      indent: 0,
      newLines: false,
      shortHand: true,
      indentIncrement: 0,
    })
  })).forEach(v => {
    fs.writeFileSync(path.join(outDir, `${v.title}.xml`), v.data);
    console.log(`Wrote ${v.title}.xml`)
  });
});
