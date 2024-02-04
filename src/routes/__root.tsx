import { Outlet, createRootRoute } from "@tanstack/react-router";
import { DehydrateRouter } from "@tanstack/react-router-server/client";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  beforeLoad: () => ({
    title: "BukanKPU - Pemilu",
  }),
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <DehydrateRouter />

      {import.meta.env.DEV && <TanStackRouterDevtools />}
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  ),
});
