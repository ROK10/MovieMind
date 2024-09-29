"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AppRouter } from "../server/api/root";
import { getUrl, transformer } from "./shared";

export const api = createTRPCReact<AppRouter>();
export const queryClient = new QueryClient();

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [queryCli] = useState(queryClient);

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryCli}>
      <api.Provider client={trpcClient} queryClient={queryCli}>
        {children}
      </api.Provider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}
