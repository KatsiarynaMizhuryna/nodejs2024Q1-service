import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Artist> {
    return await this.artistService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.artistService.create(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.artistService.remove(id);
  }
}
