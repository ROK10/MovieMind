import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Genre } from "./Genre";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdbId: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  overview: string;

  @Column()
  originalLanguage: string;

  @Column()
  originalTitle: string;

  @Column({ type: "float" })
  popularity: number;

  @Column({ type: "float" })
  voteAverage: number;

  @Column()
  voteCount: number;

  @Column()
  releaseDate: string;

  @Column()
  posterPath: string;

  @Column()
  backdropPath: string;

  @Column()
  adult: boolean;

  @Column()
  video: boolean;

  @ManyToMany(() => Genre, (genre) => genre.movies, {
    cascade: true,
  })
  @JoinTable()
  genres: Genre[];
}
