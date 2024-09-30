/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TVShow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TVShowGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieToMovieGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TVShowToTVShowGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MovieToMovieGenre" DROP CONSTRAINT "_MovieToMovieGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieToMovieGenre" DROP CONSTRAINT "_MovieToMovieGenre_B_fkey";

-- DropForeignKey
ALTER TABLE "_TVShowToTVShowGenre" DROP CONSTRAINT "_TVShowToTVShowGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_TVShowToTVShowGenre" DROP CONSTRAINT "_TVShowToTVShowGenre_B_fkey";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "MovieGenre";

-- DropTable
DROP TABLE "TVShow";

-- DropTable
DROP TABLE "TVShowGenre";

-- DropTable
DROP TABLE "_MovieToMovieGenre";

-- DropTable
DROP TABLE "_TVShowToTVShowGenre";

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "originalLanguage" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL,
    "voteAverage" DOUBLE PRECISION NOT NULL,
    "voteCount" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "posterPath" TEXT NOT NULL,
    "backdropPath" TEXT NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "video" BOOLEAN NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tvShows" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT,
    "originalLanguage" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL,
    "voteAverage" DOUBLE PRECISION NOT NULL,
    "voteCount" INTEGER NOT NULL,
    "firstAirDate" TIMESTAMP(3) NOT NULL,
    "posterPath" TEXT NOT NULL,
    "backdropPath" TEXT NOT NULL,
    "adult" BOOLEAN NOT NULL,

    CONSTRAINT "tvShows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movieGenres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "movieGenres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tvShowGenres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tvShowGenres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_movieGenresTomovies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_tvShowGenresTotvShows" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_tmdbId_key" ON "movies"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "tvShows_tmdbId_key" ON "tvShows"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "_movieGenresTomovies_AB_unique" ON "_movieGenresTomovies"("A", "B");

-- CreateIndex
CREATE INDEX "_movieGenresTomovies_B_index" ON "_movieGenresTomovies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_tvShowGenresTotvShows_AB_unique" ON "_tvShowGenresTotvShows"("A", "B");

-- CreateIndex
CREATE INDEX "_tvShowGenresTotvShows_B_index" ON "_tvShowGenresTotvShows"("B");

-- AddForeignKey
ALTER TABLE "_movieGenresTomovies" ADD CONSTRAINT "_movieGenresTomovies_A_fkey" FOREIGN KEY ("A") REFERENCES "movieGenres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movieGenresTomovies" ADD CONSTRAINT "_movieGenresTomovies_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tvShowGenresTotvShows" ADD CONSTRAINT "_tvShowGenresTotvShows_A_fkey" FOREIGN KEY ("A") REFERENCES "tvShowGenres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tvShowGenresTotvShows" ADD CONSTRAINT "_tvShowGenresTotvShows_B_fkey" FOREIGN KEY ("B") REFERENCES "tvShows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
