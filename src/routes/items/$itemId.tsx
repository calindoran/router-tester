import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getItemQuery } from "@/api/items";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/items/$itemId")({
  loader: (options) =>
    options.context.queryClient.ensureQueryData(getItemQuery(options.params.itemId)),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(getItemQuery(params.itemId));

  const effectText =
    data.effect_entries.find((entry) => entry.language.name === "en")?.short_effect ??
    "No English effect text available.";

  const flavourText =
    data.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.text.replaceAll("\f", " ") ?? "No English flavour text available.";

  return (
    <div className="reveal mx-auto max-w-4xl px-6 pt-12">
      <Card className="border-border/70 shadow-lg">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {data.name.replaceAll("-", " ").toUpperCase()}
              <span className="text-muted-foreground"> #{data.id}</span>
            </CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CardDescription>Category: {data.category.name.replaceAll("-", " ")}</CardDescription>
              <CardDescription>•</CardDescription>
              <CardDescription>Cost: {data.cost.toLocaleString()}</CardDescription>
              <CardDescription>•</CardDescription>
              <CardDescription>
                Fling Power: {data.fling_power !== null ? data.fling_power : "N/A"}
              </CardDescription>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="..">Back</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 border-t pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
              {data.sprites.default ? (
                <img
                  src={data.sprites.default}
                  alt={`${data.name} sprite`}
                  className="h-24 w-24 object-contain"
                />
              ) : (
                <span className="text-sm text-muted-foreground">No sprite</span>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">Effect</h3>
                <p className="mt-1 text-sm text-muted-foreground">{effectText}</p>
              </div>

              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Flavour Text
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{flavourText}</p>
              </div>

              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Attributes
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.attributes.length > 0 ? (
                    data.attributes.map((attribute) => (
                      <Badge key={attribute.name} variant="outline" className="bg-muted/30">
                        {attribute.name.replaceAll("-", " ")}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">None</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Held by Pokemon
            </h3>
            <div className="mt-2 flex max-h-60 flex-wrap gap-2 overflow-y-auto rounded-md border border-border/60 p-3">
              {data.held_by_pokemon.length > 0 ? (
                data.held_by_pokemon.map((holder) => (
                  <Badge key={holder.pokemon.name} variant="secondary">
                    {holder.pokemon.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No Pokemon hold this item.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
