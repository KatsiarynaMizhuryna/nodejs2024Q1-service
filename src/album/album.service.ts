import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { isValidID } from '../helpers/id_validation';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const { name, year, artistId } = createAlbumDto;
    if (name === undefined || year === undefined || artistId === undefined) {
      throw new BadRequestException('All fields are required');
    }

    const album = this.albumRepository.create({
      name,
      year,
      artistId,
    });
    return await this.albumRepository.save(album);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    isValidID(id);
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    isValidID(id);
    const album = await this.findOne(id);
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

    return await this.albumRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    isValidID(id);
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
  }
}
