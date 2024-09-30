-- CreateTable
CREATE TABLE "Movie" (
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

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TVShow" (
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

    CONSTRAINT "TVShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieGenre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TVShowGenre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TVShowGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieToMovieGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TVShowToTVShowGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "TVShow_tmdbId_key" ON "TVShow"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToMovieGenre_AB_unique" ON "_MovieToMovieGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToMovieGenre_B_index" ON "_MovieToMovieGenre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TVShowToTVShowGenre_AB_unique" ON "_TVShowToTVShowGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_TVShowToTVShowGenre_B_index" ON "_TVShowToTVShowGenre"("B");

-- AddForeignKey
ALTER TABLE "_MovieToMovieGenre" ADD CONSTRAINT "_MovieToMovieGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieToMovieGenre" ADD CONSTRAINT "_MovieToMovieGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "MovieGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TVShowToTVShowGenre" ADD CONSTRAINT "_TVShowToTVShowGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "TVShow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TVShowToTVShowGenre" ADD CONSTRAINT "_TVShowToTVShowGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "TVShowGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
