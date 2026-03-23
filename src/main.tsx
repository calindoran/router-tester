import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRouter,
	ErrorComponent,
	RouterProvider,
} from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { Spinner } from "./components/Spinner";
import { routeTree } from "./routeTree.gen";
import { auth } from "./utils/auth";

export const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	defaultPendingComponent: () => (
		<div className="pointer-events-none fixed top-20 left-2">
			<Spinner />
		</div>
	),
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	context: {
		auth: undefined!, // We'll inject this when we render
		queryClient,
	},
	defaultPreload: "intent",
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function App() {
	return (
		<RouterProvider
			router={router}
			defaultPreload="intent"
			context={{
				auth,
			}}
		/>
	);
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		// <React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>,
		// </React.StrictMode>
	);
}
