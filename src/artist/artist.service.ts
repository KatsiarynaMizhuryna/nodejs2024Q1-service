import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { isValidID } from '../helpers/id_validation';
import { database } from '../database/db';

@Injectable()
export class ArtistService {
  //private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const { name, grammy } = createArtistDto;
    if (!name || !grammy) {
      throw new BadRequestException('Name and grammy are required');
    }
    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };

    database.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return database.artists;
  }

  findOne(id: string): Artist {
    isValidID(id);
    const artist = database.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    isValidID(id);
    const artist = this.findOne(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    if (updateArtistDto.name) {
      artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }
    return artist;
  }

  remove(id: string): void {
    isValidID(id);
    const artistIndex = database.artists.findIndex((u) => u.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    database.artists.splice(artistIndex, 1);
  }
}
