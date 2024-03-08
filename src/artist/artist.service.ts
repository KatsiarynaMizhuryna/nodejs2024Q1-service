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
import { validate } from 'class-validator';
import { database } from 'src/database/db';

@Injectable()
export class ArtistService {
  //private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const { name, grammy } = createArtistDto;
    if (name === undefined || grammy === undefined) {
      throw new BadRequestException('Name and grammy are required');
    }
    if (typeof name === 'undefined' || grammy === undefined) {
      throw new BadRequestException('Name and grammy are required');
    }
    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };
    console.log(newArtist);

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
    if (
      typeof updateArtistDto.grammy !== 'boolean' ||
      typeof updateArtistDto.name !== 'string'
    ) {
      throw new BadRequestException('Invalid dto');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }
  remove(id: string) {
    isValidID(id);
    const index = database.artists.findIndex((artist) => artist.id === id);
    if (index === -1) throw new NotFoundException('Artist not found');

    const favoritesIndex = database.favorites.artists.findIndex(
      (a) => a.id === id,
    );
    if (favoritesIndex !== -1) {
      database.favorites.artists.splice(favoritesIndex, 1);
    }

    // Iterate over albums to set artistId to null for the artist being removed
    database.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    // Iterate over tracks to set artistId to null for the artist being removed
    database.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    database.artists.splice(index, 1);
  }
}
