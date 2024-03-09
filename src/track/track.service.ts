import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
import { isValidID } from '../helpers/id_validation';
import { database } from '../database/db';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto): Track {
    const { name, artistId, albumId, duration } = createTrackDto;
    if (!name || !duration) {
      throw new BadRequestException('Name and Duration are required');
    }

    const newTrack: Track = {
      id: uuidv4(),
      name,
      artistId,
      albumId,
      duration,
    };
    database.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return database.tracks;
  }

  findOne(id: string): Track {
    isValidID(id);
    const track = database.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    isValidID(id);
    const track = this.findOne(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    if (
      typeof updateTrackDto.name !== 'string' ||
      typeof updateTrackDto.duration !== 'number'
    ) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateTrackDto.name) {
      track.name = updateTrackDto.name;
    }
    if (updateTrackDto.artistId !== undefined) {
      track.artistId = updateTrackDto.artistId;
    }

    if (updateTrackDto.albumId !== undefined) {
      track.albumId = updateTrackDto.albumId;
    }

    if (updateTrackDto.duration !== undefined) {
      track.duration = updateTrackDto.duration;
    }

    return track;
  }

  remove(id: string) {
    isValidID(id);
    const trackIndex = database.tracks.findIndex((u) => u.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    database.tracks.splice(trackIndex, 1);
  }
}
