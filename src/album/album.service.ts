import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { isValidID } from '../helpers/id_validation';
import { database } from '../database/db';
import { validate } from 'class-validator';

@Injectable()
export class AlbumService {
  //private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto): Album {
    const { name, year, artistId } = createAlbumDto;
    if (name === undefined || year === undefined || artistId === undefined) {
      throw new BadRequestException('All fields are required');
    }

    const newAlbum: Album = {
      id: uuidv4(),
      name,
      year,
      artistId,
    };
    database.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return database.albums;
  }

  findOne(id: string) {
    isValidID(id);
    const album = database.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    isValidID(id);
    const album = this.findOne(id);

    if (
      typeof updateAlbumDto.name !== 'string' ||
      typeof updateAlbumDto.year !== 'number'
    ) {
      throw new BadRequestException('Invalid dto');
    }
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    if (updateAlbumDto.name) {
      album.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.year) {
      album.year = updateAlbumDto.year;
    }
    if (updateAlbumDto.artistId !== undefined) {
      album.artistId = updateAlbumDto.artistId;
    }
    return album;
  }

  remove(id: string) {
    isValidID(id);
    const albumIndex = database.albums.findIndex((u) => u.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    const favoritesIndex = database.favorites.albums.findIndex(
      (a) => a.id === id,
    );
    if (favoritesIndex !== -1) {
      database.favorites.albums.splice(favoritesIndex, 1);
    }

    database.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    database.albums.splice(albumIndex, 1);
  }
}
