import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from './entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorites])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
