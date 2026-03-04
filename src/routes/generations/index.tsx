import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getGenerationQuery } from "@/api/pokemon";

export const Route = createFileRoute("/generations/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useQuery(getGenerationQuery());

	if (isLoading) return <div>Loading...</div>;
	if (!data) return <div>Error loading generation data</div>;

	return (
		<div className="mx-auto max-w-4xl px-6 pt-12">
			<div className="bg-linear-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg overflow-hidden">
				<div className="p-6">
					<h1 className="text-3xl font-bold mb-4">Generations: {"example"}</h1>
					<div className="space-y-4">
						<p>Use the links below to navigate to different generations:</p>
						<div className="list-disc list-inside gap-3 flex flex-col">
							{data.results?.map((gen, index) => (
								<div key={gen.name}>
									<Link
										to={`/generations/$generationId`}
										params={{
											generationId: `${index + 1}`,
										}}
										className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
									>
										{gen.name}
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
