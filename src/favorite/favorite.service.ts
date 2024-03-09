import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { database } from '../database/db';
import { isValidID } from '../helpers/id_validation';

@Injectable()
export class FavoriteService {
  getAllFavorites() {
    const favorites = {
      artists: database.artists.filter((artist) =>
        database.favorites.artists.includes(artist),
      ),
      albums: database.albums.filter((album) =>
        database.favorites.albums.includes(album),
      ),
      tracks: database.tracks.filter((track) =>
        database.favorites.tracks.includes(track),
      ),
    };
    return favorites;
  }

  addTrack(id: string) {
    isValidID(id);
    const track = database.tracks.find((t) => t.id === id);
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with ID ${id} does not exist`,
      );
    }
    database.favorites.tracks.push(track);
    return track;
  }

  addAlbum(id: string) {
    isValidID(id);
    const album = database.albums.find((a) => a.id === id);
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with ID ${id} does not exist`,
      );
    }
    database.favorites.albums.push(album);
    return album;
  }

  addArtist(id: string) {
    isValidID(id);
    const artist = database.artists.find((a) => a.id === id);
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with ID ${id} does not exist`,
      );
    }
    database.favorites.artists.push(artist);
    return artist;
  }

  removeArtist(id: string) {
    isValidID(id);
    const artistIndex = database.favorites.artists.findIndex(
      (u) => u.id === id,
    );
    if (artistIndex === -1) {
      throw new UnprocessableEntityException(`Artist with ID ${id} not found`);
    }
    database.favorites.artists.splice(artistIndex, 1);
  }

  removeAlbum(id: string) {
    isValidID(id);
    const albumIndex = database.favorites.albums.findIndex((u) => u.id === id);
    if (albumIndex === -1) {
      throw new UnprocessableEntityException(`Album with ID ${id} not found`);
    }
    database.favorites.albums.splice(albumIndex, 1);
  }

  removeTrack(id: string) {
    isValidID(id);
    const trackIndex = database.favorites.tracks.findIndex((u) => u.id === id);
    if (trackIndex === -1) {
      throw new UnprocessableEntityException(`Track with ID ${id} not found`);
    }
    database.favorites.tracks.splice(trackIndex, 1);
  }
}
