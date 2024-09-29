import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Genre } from "@/db/entities/Genre";

@Entity()
export class TvShow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdbId: number;

  @Column()
  name: string;

  @Column({ type: "text" })
  overview: string;

  @Column()
  originalLanguage: string;

  @Column()
  originalName: string;

  @Column({ type: "float" })
  popularity: number;

  @Column({ type: "float" })
  voteAverage: number;

  @Column()
  voteCount: number;

  @Column()
  firstAirDate: string;

  @Column()
  posterPath: string;

  @Column()
  backdropPath: string;

  @Column()
  adult: boolean;

  @ManyToMany(() => Genre, (genre) => genre.tvShows, {
    cascade: true,
  })
  @JoinTable()
  genres: Genre[];
}
