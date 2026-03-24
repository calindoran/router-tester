import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient, useIsFetching, useIsMutating } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Spinner } from "@/components/Spinner";
import Header from "../components/Header";
import { AuthContext } from "@/auth/AuthProvider";

function RouterSpinner() {
  const fetchingCount = useIsFetching();
  const mutatingCount = useIsMutating();
  const isLoading = fetchingCount + mutatingCount > 0;

  return <Spinner show={isLoading} />;
}

export const Route = createRootRouteWithContext<{
  auth: AuthContext;
  queryClient: QueryClient;
}>()({
  beforeLoad: ({ context }) => {
    if (!context.queryClient) {
      throw new Error(
        "QueryClient is not available in the context. Make sure to provide it in the router configuration.",
      );
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const navigate = Route.useNavigate();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header navigate={navigate} />
        <div className="pointer-events-none fixed top-20 left-2">
          <RouterSpinner />
        </div>
        <main className="container mx-auto flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
