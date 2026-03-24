import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getGenerationQuery } from "@/api/pokemon";

export const Route = createFileRoute("/generations/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getGenerationQuery()),
  component: GenerationsComponent,
});

function GenerationsComponent() {
  const { data } = useSuspenseQuery(getGenerationQuery());

  return (
    <div className="mx-auto max-w-4xl px-6 pt-12">
      <div className="overflow-hidden rounded-2xl bg-linear-to-br from-indigo-50 to-pink-50 shadow-lg">
        <div className="p-6">
          <h1 className="mb-4 text-3xl font-bold">Generations: {"example"}</h1>
          <div className="space-y-4">
            <p>Use the links below to navigate to different generations:</p>
            <div className="flex list-inside list-disc flex-col gap-3">
              {data.results?.map((gen, index) => (
                <div key={gen.name}>
                  <Link
                    to={`/generations/$generationId`}
                    params={{
                      generationId: `${index + 1}`,
                    }}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
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
