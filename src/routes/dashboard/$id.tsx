import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getPokemonQuery } from "@/api/pokemon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/$id")({
  loader: (options) =>
    options.context.queryClient.ensureQueryData(getPokemonQuery(options.params.id)),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(getPokemonQuery(params.id));

  const { id, name, sprites, types = [], abilities = [], stats = [], height, weight } = data;

  const displayName = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const artwork = sprites?.other?.["official-artwork"]?.front_default || sprites?.front_default;

  const typeColors: Record<string, string> = {
    fire: "var(--pokemon-type-fire)",
    water: "var(--pokemon-type-water)",
    grass: "var(--pokemon-type-grass)",
    electric: "var(--pokemon-type-electric)",
    rock: "var(--pokemon-type-rock)",
    ground: "var(--pokemon-type-ground)",
    psychic: "var(--pokemon-type-psychic)",
    ice: "var(--pokemon-type-ice)",
    dragon: "var(--pokemon-type-dragon)",
    dark: "var(--pokemon-type-dark)",
    ghost: "var(--pokemon-type-ghost)",
    steel: "var(--pokemon-type-steel)",
    normal: "var(--pokemon-type-normal)",
    poison: "var(--pokemon-type-poison)",
    fairy: "var(--pokemon-type-fairy)",
    bug: "var(--pokemon-type-bug)",
    fighting: "var(--pokemon-type-fighting)",
    flying: "var(--pokemon-type-flying)",
  };

  const statPct = (v: number) => Math.min(100, Math.round((v / 255) * 100));

  return (
    <div className="reveal mx-auto max-w-4xl px-6 pt-12">
      <Card className="border-border/70 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            {/* Artwork */}
            <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 shadow-inner">
              {artwork ? (
                <img src={artwork} alt={name} className="h-40 w-40 object-contain drop-shadow-sm" />
              ) : (
                <div className="text-sm text-muted-foreground">No image</div>
              )}
            </div>

            {/* Header & badges */}
            <div className="flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl font-extrabold tracking-tight md:text-3xl">
                    {displayName(name)} <span className="text-muted-foreground">#{id}</span>
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <CardDescription>Height: {(height ?? 0) / 10} m</CardDescription>
                    <CardDescription>•</CardDescription>
                    <CardDescription>Weight: {(weight ?? 0) / 10} kg</CardDescription>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={".."}>Back</Link>
                </Button>
              </div>

              {/* Types */}
              <div className="mt-4 flex flex-wrap gap-2">
                {types.map((t) => {
                  const typeName = t.type.name;
                  const color = typeColors[typeName] ?? "var(--muted-foreground)";
                  return (
                    <Badge
                      key={typeName}
                      className="border-transparent text-white"
                      style={{ backgroundColor: color }}
                    >
                      {displayName(typeName)}
                    </Badge>
                  );
                })}
              </div>

              {/* Abilities */}
              <div className="mt-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Abilities
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {abilities.map((a) => (
                    <Badge
                      key={a.ability.name}
                      variant="outline"
                      className="bg-muted/30"
                      title={a.ability.name}
                    >
                      {displayName(a.ability.name.replace("-", " "))}
                      {a.is_hidden ? " (Hidden)" : ""}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Stats */}
        <CardHeader className="border-t">
          <h3 className="mb-4 text-base font-semibold tracking-tight text-foreground">
            Base Stats
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stats.map((s) => (
              <div key={s.stat.name} className="flex items-center gap-4">
                <div className="w-28 text-xs text-muted-foreground">
                  {displayName(s.stat.name.replace("-", " "))}
                </div>
                <div className="flex-1">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-linear-to-r from-primary/75 to-accent/80"
                      style={{ width: `${statPct(s.base_stat)}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right font-mono text-sm text-foreground">
                  {s.base_stat}
                </div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
