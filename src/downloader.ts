import axios from 'axios';
import type { ISongCollection, Song } from './types';

const DOWNLOAD_URL = 'https://www.songpraise.com/api/songs/language/5a2d253b8c270b37345af0c3';

const SONGCOLLECTION_URL = (songUuid: string) => `http://www.songpraise.com/api/songCollections/song/${songUuid}`;

export const downloadSongpraiseData = async (): Promise<Song[]> =>
  (await axios.get<Song[]>(DOWNLOAD_URL)).data;

export const getCollectionForSong = async (uuid: string): Promise<ISongCollection[] | undefined> => (
  axios.get<ISongCollection[]>(
    SONGCOLLECTION_URL(uuid),
    { timeout: 0 },
  ).then(resp => resp.data)
    .catch(error => {
      console.error(error);
      return undefined;
    })
);
