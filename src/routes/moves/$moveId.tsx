import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getMoveQuery } from "@/api/moves";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/moves/$moveId")({
  loader: (options) =>
    options.context.queryClient.ensureQueryData(getMoveQuery(options.params.moveId)),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(getMoveQuery(params.moveId));

  const effectText =
    data.effect_entries.find((entry) => entry.language.name === "en")?.short_effect ??
    "No English effect text available.";

  const flavourText =
    data.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text.replaceAll("\n", " ") ?? "No English flavour text available.";

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
              <CardDescription className="capitalize">Type: {data.type.name}</CardDescription>
              <CardDescription>•</CardDescription>
              <CardDescription className="capitalize">
                Damage Class: {data.damage_class.name}
              </CardDescription>
              <CardDescription>•</CardDescription>
              <CardDescription>PP: {data.pp ?? "N/A"}</CardDescription>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="..">Back</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 border-t pt-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label="Power" value={data.power ?? "N/A"} />
            <Metric label="Accuracy" value={data.accuracy !== null ? `${data.accuracy}%` : "N/A"} />
            <Metric label="Priority" value={data.priority} />
            <Metric
              label="Effect Chance"
              value={data.effect_chance !== null ? `${data.effect_chance}%` : "N/A"}
            />
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Effect</h3>
            <p className="mt-1 text-sm text-muted-foreground">{effectText}</p>
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Flavour Text</h3>
            <p className="mt-1 text-sm text-muted-foreground">{flavourText}</p>
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Stat Changes</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.stat_changes.length > 0 ? (
                data.stat_changes.map((statChange) => {
                  const prefix = statChange.change > 0 ? "+" : "";
                  return (
                    <Badge key={statChange.stat.name} variant="outline" className="bg-muted/30">
                      {statChange.stat.name.replaceAll("-", " ")}: {prefix}
                      {statChange.change}
                    </Badge>
                  );
                })
              ) : (
                <Badge variant="outline">None</Badge>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">Meta</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.meta ? (
                <>
                  <Badge variant="secondary" className="capitalize">
                    Ailment: {data.meta.ailment.name}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    Category: {data.meta.category.name}
                  </Badge>
                  <Badge variant="secondary">Crit Rate: {data.meta.crit_rate}</Badge>
                  <Badge variant="secondary">Flinch Chance: {data.meta.flinch_chance}%</Badge>
                </>
              ) : (
                <Badge variant="outline">No meta data</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
