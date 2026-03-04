import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getGenerationDetailsQuery } from "@/api/pokemon";

export const Route = createFileRoute("/generations/$generationId")({
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();
	const { data, isLoading } = useQuery(
		getGenerationDetailsQuery(params.generationId),
	);

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Error loading generation data</div>;

	return (
		<div className="mx-auto max-w-4xl px-6 pt-12">
			<div className="bg-linear-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg overflow-hidden">
				<div className="flex items-center justify-between p-4">
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight">
							{data.name} <span className="text-gray-500">#{data.id}</span>
						</h1>
						<div className="mt-2 flex items-center gap-2">
							<span className="text-sm text-gray-600">
								Main Region: {data.main_region.name}
							</span>
							<span className="text-sm text-gray-600">•</span>
							<span className="text-sm text-gray-600">
								Number of Pokemon Species: {data.pokemon_species.length}
							</span>
						</div>
					</div>
					<Link
						to={".."}
						className="text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm"
					>
						Back
					</Link>
				</div>

				<div className="p-6">
					<div className="mt-8">
						<h2 className="text-2xl font-semibold mb-4">Pokemon Species:</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							{data.pokemon_species.map((species) => (
								<Link
									key={species.name}
									to={`/$id`}
									params={{
										id: species.name,
									}}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors text-center"
								>
									{species.name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
