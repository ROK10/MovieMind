import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { AppDataSource } from "@/db/data-source"; 

// Context without session/authentication
const createInnerTRPCContext = () => {
  return {
    db: AppDataSource,
  };
};

// The actual context you will use in your router
export const createTRPCContext = async () => {
  return createInnerTRPCContext();
};

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Export router and procedure creation functions
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
