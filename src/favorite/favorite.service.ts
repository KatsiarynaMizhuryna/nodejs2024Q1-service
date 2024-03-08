import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite, FavoritesResponse } from './entities/favorite.entity';
import { database } from '../database/db';
import { isValidID } from '../helpers/id_validation';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoriteService {
  private findItemById<T extends { id: string }>(
    items: T[],
    id: string,
  ): T | undefined {
    return items.find((item) => item.id === id);
  }
  getAllFavorites(): FavoritesResponse {
    const artists: Artist[] = database.favorites.artists.map((artistId) =>
      this.findItemById(database.artists, artistId),
    );
    const albums: Album[] = database.favorites.albums.map((albumId) =>
      this.findItemById(database.albums, albumId),
    );
    const tracks: Track[] = database.favorites.tracks.map((trackId) =>
      this.findItemById(database.tracks, trackId),
    );

    return { artists, albums, tracks };
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
    const album = database.tracks.find((a) => a.id === id);
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
