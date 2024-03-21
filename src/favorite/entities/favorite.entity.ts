import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { Track } from '../../track/entities/track.entity';

import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist, { onDelete: 'SET NULL' })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album, { onDelete: 'SET NULL' })
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track, { onDelete: 'SET NULL' })
  @JoinTable()
  tracks: Track[];
}
