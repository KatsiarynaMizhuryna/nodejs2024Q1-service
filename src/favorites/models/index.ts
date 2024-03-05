import { Artist } from 'src/artists/models';
import { Album } from 'src/albums/models';
import { Track } from 'src/tracks/models';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
