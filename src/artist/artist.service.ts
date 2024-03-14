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
import { database } from 'src/database/db';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    isValidID(id);
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = createArtistDto;
    if (name === undefined || grammy === undefined) {
      throw new BadRequestException('Name and grammy are required');
    }
    if (typeof name !== 'string' || typeof grammy !== 'boolean') {
      throw new BadRequestException('Invalid dto');
    }

    const newArtist = this.artistRepository.create({
      name,
      grammy,
    });
    return await this.artistRepository.save(newArtist);
  }
  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    isValidID(id);
    const artist = await this.findOne(id);
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    return await this.artistRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    isValidID(id);
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
  }
}
