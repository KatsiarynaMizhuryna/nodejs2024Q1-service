import { PartialType } from '@nestjs/swagger';
import { CreateArtistDto } from './create-artist.dto';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  name: string;
  grammy: boolean;
}
