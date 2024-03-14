import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column({ default: false })
  grammy: boolean;
  @OneToMany(() => Album, (album) => album.artist, {
    cascade: true,
  })
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist, {
    cascade: true,
  })
  tracks: Track[];
}
