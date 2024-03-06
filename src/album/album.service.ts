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

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto): Album {
    const { name, year, artistId } = createAlbumDto;

    if (!name || !year || !artistId) {
      throw new BadRequestException('All fields are required');
    }

    const newAlbum: Album = {
      id: uuidv4(),
      name,
      year,
      artistId,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    isValidID(id);
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    isValidID(id);
    const album = this.findOne(id);
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
    const albumIndex = this.albums.findIndex((u) => u.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    this.albums.splice(albumIndex, 1);
  }
}
