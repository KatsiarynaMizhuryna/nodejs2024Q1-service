import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Artist } from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  getAllArtists() {
    return this.artists;
  }

  getArtistById(id: string) {
    const artist = this.artists.find((u) => u.id === id);
    if (!artist) {
      throw new NotFoundException('Artist does not found');
    }
    return artist;
  }

  createArtist(artist: Artist) {
    const { name, grammy } = artist;

    if (!name || !grammy) {
      throw new BadRequestException('Name and grammy are required');
    }

    const newArtist = {
      id: uuidv4(),
      name,
      grammy,
    };

    this.artists.push(newArtist);

    return {
      statusCode: 201,
      data: newArtist,
    };
  }
  updateArtistInfo(
    id: string,
    artist: Artist,
  ): { statusCode: number; data: Artist } {
    const updatedArtist = this.getArtistById(id);

    if (!updatedArtist) {
      throw new NotFoundException('Artist does not exist');
    }

    updatedArtist.name = artist.name;
    updatedArtist.grammy = artist.grammy;

    return {
      statusCode: 200,
      data: updatedArtist,
    };
  }

  deleteArtist(id: string): { statusCode: number } {
    const artistIndex = this.artists.findIndex((u) => u.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist does not found');
    }
    this.artists.splice(artistIndex, 1);
    return {
      statusCode: 204,
    };
  }
}
