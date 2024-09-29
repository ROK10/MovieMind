import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createContext } from "./context";

export const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});
export const router = t.router;
export const procedure = t.procedure;
