import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const { name, grammy } = createArtistDto;
    if (!name) {
      throw new NotFoundException('Name is required');
    }
    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };

    this.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.findOne(id);
    if (updateArtistDto.name) {
      artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }
    return artist;
  }

  remove(id: string): void {
    const artistIndex = this.artists.findIndex((u) => u.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    this.artists.splice(artistIndex, 1);
  }
}
