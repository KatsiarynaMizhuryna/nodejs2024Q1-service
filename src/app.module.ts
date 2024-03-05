import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './users/controllers/user.controller';
import { UserService } from './users/services/user.service';
import { ArtistService } from './artists/services/artist.service';
import { ArtistController } from './artists/controllers/artist.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, ArtistController],
  providers: [AppService, UserService, ArtistService],
})
export class AppModule {}
