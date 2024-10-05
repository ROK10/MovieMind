import { createTRPCRouter, publicProcedure } from "@/app/server/api/trpc";
import z from "zod";

const LIMIT = 10;

export const moviesRouter = createTRPCRouter({
  getAllMovies: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        cursor: z.string().nullish(),
      })
    )
    .output(
      z.object({
        movies: z.array(
          z.object({
            id: z.number(),
            tmdbId: z.number(),
            title: z.string(),
            overview: z.string().optional(),
            original_language: z.string(),
            original_title: z.string(),
            popularity: z.number(),
            vote_average: z.number(),
            vote_count: z.number(),
            release_date: z.date(),
            poster_path: z.string(),
            backdrop_path: z.string().nullable(),
            adult: z.boolean(),
            video: z.boolean(),
            genres: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
              })
            ),
          })
        ),
        nextCursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const movies = await ctx.db.movie.findMany({
        take: LIMIT + 1,
        cursor: cursor ? { id: Number(cursor) } : undefined,
        orderBy: {
          id: "asc",
        },
        include: {
          movie_genres: {
            include: {
              genre: true,
            },
          },
        },
      });

      const formattedMovies = movies.map((movie) => ({
        id: movie.id,
        tmdbId: movie.tmdbId,
        title: movie.title,
        overview: movie.overview ?? undefined,
        original_language: movie.original_language,
        original_title: movie.original_title,
        popularity: movie.popularity,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        adult: movie.adult,
        video: movie.video,
        genres: movie.movie_genres.map((movie_genre) => ({
          id: movie_genre.genre.id,
          name: movie_genre.genre.name,
        })),
      }));

      let nextCursor: string | undefined = undefined;
      if (movies.length > LIMIT) {
        const nextItem = movies.pop();
        nextCursor = nextItem!.id.toString();
      }

      return {
        movies: formattedMovies,
        nextCursor,
      };
    }),
  executeQuery: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query } = input;

      // Remove formatting artifacts like 'sql', backticks, and code blocks from GPT response
      let cleanedQuery = query.replace(/--.*\n/g, "").trim(); // Remove SQL comments
      cleanedQuery = cleanedQuery.replace(/```/g, ""); // Remove backticks if present
      cleanedQuery = cleanedQuery.replace(/sql\s+/g, ""); // Remove any 'sql' prefix
      cleanedQuery = cleanedQuery.replace(/["“”‘’]/g, "'"); // Normalize quotation marks

      console.log("Cleaned SQL Query:", cleanedQuery);
      // Ensure the query is safe and valid
      try {
        const result = await ctx.db.$queryRawUnsafe(cleanedQuery); // Use Prisma to execute the cleaned SQL query
        return result;
      } catch (error) {
        console.error("Error executing query:", error);
        if (error instanceof Error) {
          throw new Error("Error executing query: " + error.message);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    }),
  getFullTableAsString: publicProcedure.query(async ({ ctx }) => {
    try {
      const movies = await ctx.db.movie.findMany();

      // Convert each movie object to a string and join them with newlines
      const moviesString = movies
        .map((movie) => JSON.stringify(movie))
        .join("\n");

      return moviesString;
    } catch (error) {
      console.error("Error fetching full table:", error);
      if (error instanceof Error) {
        throw new Error("Error fetching full table: " + error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }),
});
