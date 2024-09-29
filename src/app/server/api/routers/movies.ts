import { createTRPCRouter, publicProcedure } from "@/app/server/api/trpc";
import z from "zod";

const LIMIT = 10;

export const moviesRouter = createTRPCRouter({
  getMovies: publicProcedure.query(async ({ ctx }) => {
    const movies = await ctx.db.getRepository("Movie").find({
      take: LIMIT,
      order: {
        id: "ASC",
      },
    });
  }),
});
