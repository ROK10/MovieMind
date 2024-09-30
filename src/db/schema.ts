import {
  pgTable,
  integer,
  text,
  varchar,
  boolean,
  doublePrecision,
  date,
  serial,
} from "drizzle-orm/pg-core";

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").unique(),
  title: varchar("title", { length: 255 }),
  overview: text("overview"),
  originalLanguage: varchar("original_language", { length: 50 }),
  originalTitle: varchar("original_title", { length: 255 }),
  popularity: doublePrecision("popularity"),
  voteAverage: doublePrecision("vote_average"),
  voteCount: integer("vote_count"),
  releaseDate: date("release_date"),
  posterPath: varchar("poster_path", { length: 255 }),
  backdropPath: varchar("backdrop_path", { length: 255 }),
  adult: boolean("adult"),
  video: boolean("video"),
});

export const tvShows = pgTable("tv_shows", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").unique(),
  name: varchar("name", { length: 255 }),
  overview: text("overview"),
  originalLanguage: varchar("original_language", { length: 50 }),
  originalName: varchar("original_name", { length: 255 }),
  popularity: doublePrecision("popularity"),
  voteAverage: doublePrecision("vote_average"),
  voteCount: integer("vote_count"),
  firstAirDate: date("first_air_date"),
  posterPath: varchar("poster_path", { length: 255 }),
  backdropPath: varchar("backdrop_path", { length: 255 }),
  adult: boolean("adult"),
});

export const movieGenres = pgTable("movie_genres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const tvGenres = pgTable("tv_genres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});
