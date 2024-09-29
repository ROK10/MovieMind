import { createTRPCRouter } from "@/app/server/api/trpc";
import { moviesRouter } from "@/app/server/api/routers/movies";

export const appRouter = createTRPCRouter({
  movies: moviesRouter,
});

export type AppRouter = typeof appRouter;
