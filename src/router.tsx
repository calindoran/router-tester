import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const queryClient = new QueryClient();
	const router = createRouter({
		routeTree,
		context: {
			queryClient,
		},
		defaultPreload: "intent",
		// Since we're using React Query, we don't want loader calls to ever be stale
		// This will ensure that the loader is always called when the route is preloaded or visited
		defaultPreloadStaleTime: 0,
		scrollRestoration: true,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		// optional:
		// handleRedirects: true,
		// wrapQueryClient: true,
	});

	return router;
};
