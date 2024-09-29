// src/entities/Genre.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Movie } from "@/entities/Movie";
import { TvShow } from "@/entities/TvShow";

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];

  @ManyToMany(() => TvShow, (tvShow) => tvShow.genres)
  tvShows: TvShow[];
}
