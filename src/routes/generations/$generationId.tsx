import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getGenerationDetailsQuery } from "@/api/pokemon";

export const Route = createFileRoute("/generations/$generationId")({
  loader: (options) =>
    options.context.queryClient.ensureQueryData(
      getGenerationDetailsQuery(options.params.generationId),
    ),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(getGenerationDetailsQuery(params.generationId));

  return (
    <div className="mx-auto max-w-4xl px-6 pt-12">
      <div className="overflow-hidden rounded-2xl bg-linear-to-br from-indigo-50 to-pink-50 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {data.name} <span className="text-gray-500">#{data.id}</span>
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600">Main Region: {data.main_region.name}</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">
                Number of Pokemon Species: {data.pokemon_species.length}
              </span>
            </div>
          </div>
          <Link
            to={".."}
            className="rounded-full bg-white/70 px-3 py-1 text-sm shadow-sm hover:bg-white"
          >
            Back
          </Link>
        </div>

        <div className="p-6">
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold">Pokemon Species:</h2>
            <div className="mt-2 max-h-120 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {data.pokemon_species.map((species) => (
                  <Link
                    key={species.name}
                    to={`/dashboard/$id`}
                    params={{
                      id: species.name,
                    }}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-center text-white shadow transition-colors hover:bg-blue-600"
                  >
                    {species.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
