import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Movie } from "@/db/entities/Movie";
import { TvShow } from "@/db/entities/TvShow";

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
