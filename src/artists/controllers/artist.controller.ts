import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Artist } from '../models';
import { ArtistService } from '../services/artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string) {
    return this.artistService.getArtistById(id);
  }

  @Post()
  createArtist(@Body() artist: Artist) {
    return this.artistService.createArtist(artist);
  }

  @Put(':id')
  updateArtistInfo(@Param('id') id: string, @Body() artist: Artist) {
    return this.artistService.updateArtistInfo(id, artist);
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string) {
    return this.artistService.deleteArtist(id);
  }
}
