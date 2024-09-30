import { createTRPCRouter, publicProcedure } from "@/app/server/api/trpc";
import z from "zod";

const LIMIT = 10;

export const moviesRouter = createTRPCRouter({
  getAllForContractsPage: publicProcedure
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
            originalLanguage: z.string(),
            originalTitle: z.string(),
            popularity: z.number(),
            voteAverage: z.number(),
            voteCount: z.number(),
            releaseDate: z.date(),
            posterPath: z.string(),
            backdropPath: z.string(),
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
      const movies = await ctx.db.movies.findMany({
        take: LIMIT + 1,
        cursor: cursor ? { id: Number(cursor) } : undefined,
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          tmdbId: true,
          title: true,
          overview: true,
          originalLanguage: true,
          originalTitle: true,
          popularity: true,
          voteAverage: true,
          voteCount: true,
          releaseDate: true,
          posterPath: true,
          backdropPath: true,
          adult: true,
          video: true,
          genres: true,
        },
      });

      const formattedMovies = movies.map((movie) => ({
        ...movie,
        overview: movie.overview ?? undefined,
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
});
