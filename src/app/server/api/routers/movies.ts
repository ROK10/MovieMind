import { createTRPCRouter, publicProcedure } from "@/app/server/api/trpc";
import { movies } from "@/db/schema";
import z from "zod";

const LIMIT = 10;

export const moviesRouter = createTRPCRouter({
  getMovies: publicProcedure.query(async ({ ctx }) => {
    // Fetch movies using Drizzle ORM's query methods
    const movieList = await ctx.db
      .select()
      .from(movies as any)
      .limit(LIMIT)
      .execute();

    return movieList;
  }),
});
