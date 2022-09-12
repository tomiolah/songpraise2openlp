import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { uniq } from 'lodash';
import { Promise as P } from 'bluebird';
import { OpenLyricsXMLConverter, PlaintextConverter } from './converters';
import { downloadSongpraiseData, getCollectionForSong } from './downloader';
import { ConversionTargets } from './types';
import type { ISongCollection, Song } from './types';
import type { IConverter } from './converters/converters.types';
import { stripAccents } from './util';

const outDir = join(cwd(), 'output');

const SupportedTargets: Record<ConversionTargets, IConverter> = {
  [ConversionTargets.OpenLyricsXML]: OpenLyricsXMLConverter,
  [ConversionTargets.PlainText]: PlaintextConverter,
};

const processSong = ({ song, targets, collections }: {
  song: Song;
  targets: ConversionTargets[];
  collections: ISongCollection[] | undefined;
}) => {
  console.log(`Processing song ${song.title} ${collections ? 'with' : 'without'} collection data.`);
  const title = stripAccents({ title: song.title, collections });
  const collection = collections && collections.length > 0 ? collections[0] : undefined;
  return {
    title,
    targets: uniq(targets).map((target) => {
      console.log(`Converting ${song.title} to target '${target}'...`);
      return {
        target,
        content: SupportedTargets[target].convertSong({ song, collection }),
      };
    }),
  };
};

async function Main(targets: ConversionTargets[]) {
  const songs = await downloadSongpraiseData();
  const songsWithCollections = await P.map(
    songs.slice(0, 5),
    async (value) => {
      console.log(`Getting collection for ${value.title}`);
      return {
        song: value,
        collections: await getCollectionForSong(value.uuid),
      };
    },
    { concurrency: 3 },
  );

  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }

  const convertedSongs = songsWithCollections.map((songWithCollection) => processSong({
    targets,
    ...songWithCollection,
  }));

  for (const v of convertedSongs) {
    for (const t of v.targets) {
      if (t.content) {
        try {
          const fileName = SupportedTargets[t.target].getFilename(v.title);
          const targetPath = join(outDir, t.target);

          if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
          }

          const outPath = join(targetPath, fileName);
          writeFileSync(outPath, t.content);
          console.log(`Wrote ${t.target}/${fileName}`);
        } catch (error: any) {
          console.error(error);
          continue;
        }
      }
    }
  }
}

Main([
  // ConversionTargets.OpenLyricsXML,
  ConversionTargets.PlainText,
]).catch((error) => {
  console.error(error);
});
