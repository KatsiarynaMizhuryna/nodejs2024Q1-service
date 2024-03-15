import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
    const favorites = await this.getFavs();
    const favResponse = {
      albums: favorites.albums || [],
      artists: favorites.artists || [],
      tracks: favorites.tracks || [],
    };
    return favResponse;
  }

  private async getFavs() {
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

    return favorites;
  }

  async addTrack(id: string) {
    isValidID(id);
    const track = await this.entityManager.findOneBy(Track, { id });
    if (!track) {
      throw new UnprocessableEntityException(`Track with ID ${id} not found`);
    }
    const favorites = await this.getFavs();
    favorites['tracks'].push(track as any);
    return await this.favRepository.save(favorites);
  }

  async addAlbum(id: string) {
    isValidID(id);
    const album = await this.entityManager.findOneBy(Album, { id });
    if (!album) {
      throw new UnprocessableEntityException(`Album with ID ${id} not found`);
    }
    const favorites = await this.getFavs();
    favorites['albums'].push(album as any);
    return await this.favRepository.save(favorites);
  }

  async addArtist(id: string) {
    isValidID(id);
    const artist = await this.entityManager.findOneBy(Artist, { id });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with ID ${id} does not exist`,
      );
    }
    const favorites = await this.getFavs();
    favorites['artists'].push(artist as any);
    return await this.favRepository.save(favorites);
  }

  async removeArtist(id: string) {
    isValidID(id);
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
    isValidID(id);
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
    isValidID(id);
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
