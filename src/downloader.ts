import axios from 'axios';
import { Song } from './types';

const DOWNLOAD_URL = 'https://github.com/tomiolah/mkmbgy-db/blob/main/data.json?raw=true';

export const downloadSongpraiseData = async (): Promise<Song[]> =>
  (await axios.get<Song[]>(DOWNLOAD_URL)).data;
