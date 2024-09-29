import axios from "axios";
import { AppDataSource } from '../src/db/data-source';
import { Genre } from "@/entities/Genre";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

async function importGenres() {
  try {
    const movieGenresResponse = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      }
    );

    const tvGenresResponse = await axios.get(
      "https://api.themoviedb.org/3/genre/tv/list?language=en",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      }
    );

    const genresData = [
      ...movieGenresResponse.data.genres,
      ...tvGenresResponse.data.genres,
    ];

    await AppDataSource.initialize();

    for (const genre of genresData) {
      const existingGenre = await AppDataSource.getRepository(Genre).findOne({
        where: { id: genre.id },
      });

      if (!existingGenre) {
        const newGenre = AppDataSource.getRepository(Genre).create({
          id: genre.id,
          name: genre.name,
        });
        await AppDataSource.getRepository(Genre).save(newGenre);
        console.log(`Imported genre: ${genre.name}`);
      }
    }

    console.log("Genres import completed.");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error importing genres:", error);
  }
}

importGenres();
