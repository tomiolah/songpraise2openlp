import type { ISongCollection } from './types';

export const rewriteMap: Record<string, string> = {
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
  ' ': '_', '. ': '_',
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

export const map = Object.entries(rewriteMap);

export const collectionNumber = (collections?: ISongCollection[]) => `${
  collections
  && collections.length > 0
  && collections[0]
  && collections[0].songCollectionElements
  && collections[0].songCollectionElements.length > 0
  && collections[0].songCollectionElements[0]
  && collections[0].songCollectionElements[0].ordinalNumber
    ? `${collections[0].songCollectionElements[0].ordinalNumber}. `
    : ''
}`;

export const stripAccents = ({ title, collections }: { title: string; collections?: ISongCollection[] }) => map.reduce(
  (p, c) => {
    const re = new RegExp(c[0].replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
    return p.replace(re, c[1]);
  },
  `${collectionNumber(collections)}${title}`,
).replace('__', '_');
