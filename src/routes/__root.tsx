import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	type QueryClient,
	useIsFetching,
	useIsMutating,
} from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Spinner } from "@/components/Spinner";
import { Auth } from "@/utils/auth";
import Header from "../components/Header";
import appCss from "../styles.css?url";

function RouterSpinner() {
	const fetchingCount = useIsFetching();
	const mutatingCount = useIsMutating();
	const isLoading = fetchingCount + mutatingCount > 0;

	return <Spinner show={isLoading} />;
}

export const Route = createRootRouteWithContext<{
	auth: Auth;
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "PokeRouter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Header />
			<div className="pointer-events-none fixed top-20 left-2">
				<RouterSpinner />
			</div>
			<Outlet />
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
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
