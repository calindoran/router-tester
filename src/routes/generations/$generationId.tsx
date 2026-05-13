import { getGenerationDetailsQuery } from "@/api/pokemon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

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
    <div className="reveal mx-auto max-w-4xl px-6 pt-12">
      <Card className="border-border/70 shadow-lg">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight md:text-3xl">
              <span className="text-muted-foreground">Game Gen #{data.id}</span>
            </CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <CardDescription>Main Region: {data.main_region.name}</CardDescription>
              <CardDescription>•</CardDescription>
              <CardDescription>
                Number of Pokemon Species: {data.pokemon_species.length}
              </CardDescription>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={".."}>Back</Link>
          </Button>
        </CardHeader>

        <CardContent>
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold tracking-tight md:text-2xl">
              Pokemon Species in this Generation
            </h2>
            <div className="mt-2 max-h-120 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {data.pokemon_species.map((species) => {
                  const delay = (species.name.length % 12) * 20;
                  const pokemonName = species.name.charAt(0).toUpperCase() + species.name.slice(1);
                  return (
                    <Button
                      key={species.name}
                      asChild
                      variant="secondary"
                      size="sm"
                      className="reveal-stagger justify-center"
                      style={{ animationDelay: `${delay}ms` }}
                    >
                      <Link
                        to={`/dashboard/$id`}
                        params={{
                          id: species.name,
                        }}
                      >
                        <span>{pokemonName}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
