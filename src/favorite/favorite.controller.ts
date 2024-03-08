import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  getAllFavorites() {
    return this.favoriteService.getAllFavorites();
  }

  @Post('/track/:id')
  @HttpCode(201)
  addTrackToFavorite(@Param('id') trackId: string) {
    return this.favoriteService.addTrack(trackId);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrackFromFavorite(@Param('id') trackId: string) {
    return this.favoriteService.removeTrack(trackId);
  }

  @Post('/album/:id')
  @HttpCode(201)
  addAlbumToFavorite(@Param('id') albumId: string) {
    return this.favoriteService.addAlbum(albumId);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbumFromFavorite(@Param('id') albumId: string) {
    return this.favoriteService.removeAlbum(albumId);
  }

  @Post('/artist/:id')
  @HttpCode(201)
  addArtistToFavorite(@Param('id') artistId: string) {
    return this.favoriteService.addArtist(artistId);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtistFromFavorite(@Param('id') artistId: string) {
    return this.favoriteService.removeArtist(artistId);
  }
}
