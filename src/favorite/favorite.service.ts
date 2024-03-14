import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { database } from '../database/db';
import { isValidID } from '../helpers/id_validation';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Favorites } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favRepository: Repository<Favorites>,
    private readonly entityManager: EntityManager,
  ) {}

  async getAllFavorites() {
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });

    if (!favorites) {
      favorites = {
        albums: [],
        artists: [],
        tracks: [],
      } as Favorites;
    }
    const allFavorites = {
      albums: favorites.albums,
      artists: favorites.artists,
      tracks: favorites.tracks,
    };

    return allFavorites;
  }

  async addTrack(id: string) {
    const track = await this.entityManager.findOneBy(Track, { id });
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with ID ${id} does not exist`,
      );
    }
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    favorites['tracks'].push(track as any);
    await this.favRepository.save(favorites);
  }

  async addAlbum(id: string) {
    const album = await this.entityManager.findOneBy(Album, { id });
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with ID ${id} does not exist`,
      );
    }
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    favorites['albums'].push(album as any);
    await this.favRepository.save(favorites);
  }

  async addArtist(id: string) {
    const artist = await this.entityManager.findOneBy(Artist, { id });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with ID ${id} does not exist`,
      );
    }
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    favorites['artists'].push(artist as any);
    await this.favRepository.save(favorites);
  }

  async removeArtist(id: string) {
    const artist = await this.entityManager.findOneBy(Artist, { id });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} does not exist`);
    }
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    const artistIndex = favorites['artists'].findIndex(
      (a) => a.id === artist.id,
    );

    favorites['artists'].splice(artistIndex, 1);
    await this.favRepository.save(favorites);
  }

  async removeAlbum(id: string) {
    const album = await this.entityManager.findOneBy(Album, { id });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} does not exist`);
    }
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    const albumIndex = favorites['albums'].findIndex((a) => a.id === album.id);

    favorites['albums'].splice(albumIndex, 1);
    await this.favRepository.save(favorites);
  }

  async removeTrack(id: string) {
    const track = await this.entityManager.findOneBy(Track, { id });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} does not exist`);
    }
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    const trackIndex = favorites['tracks'].findIndex((t) => t.id === track.id);

    favorites['tracks'].splice(trackIndex, 1);
    await this.favRepository.save(favorites);
  }
}
