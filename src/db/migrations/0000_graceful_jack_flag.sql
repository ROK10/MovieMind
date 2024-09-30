CREATE TABLE IF NOT EXISTS "movie_genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer,
	"title" varchar(255),
	"overview" text,
	"original_language" varchar(50),
	"original_title" varchar(255),
	"popularity" double precision,
	"vote_average" double precision,
	"vote_count" integer,
	"release_date" date,
	"poster_path" varchar(255),
	"backdrop_path" varchar(255),
	"adult" boolean,
	"video" boolean,
	CONSTRAINT "movies_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tv_genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tv_shows" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer,
	"name" varchar(255),
	"overview" text,
	"original_language" varchar(50),
	"original_name" varchar(255),
	"popularity" double precision,
	"vote_average" double precision,
	"vote_count" integer,
	"first_air_date" date,
	"poster_path" varchar(255),
	"backdrop_path" varchar(255),
	"adult" boolean,
	CONSTRAINT "tv_shows_tmdb_id_unique" UNIQUE("tmdb_id")
);
