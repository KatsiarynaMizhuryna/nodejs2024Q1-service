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

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

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
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string): Track {
    isValidID(id);
    const track = this.tracks.find((t) => t.id === id);
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
    const trackIndex = this.tracks.findIndex((u) => u.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    this.tracks.splice(trackIndex, 1);
  }
}
