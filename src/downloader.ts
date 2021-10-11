import axios from 'axios';
import { ISongCollection, Song } from './types';

const DOWNLOAD_URL = 'https://github.com/tomiolah/mkmbgy-db/blob/main/data.json?raw=true';

const SONGCOLLECTION_URL = (songUuid: string) => `http://www.songpraise.com/api/songCollections/song/${songUuid}`;

export const downloadSongpraiseData = async (): Promise<Song[]> =>
  (await axios.get<Song[]>(DOWNLOAD_URL)).data;

export const getCollectionForSong = async (uuid: string): Promise<ISongCollection[] | undefined> =>
  (await axios.get<ISongCollection[]>(SONGCOLLECTION_URL(uuid), { timeout: 0 }).then((resp) => resp.data).catch((err) => {
    console.error(err);
    return undefined;
  }))