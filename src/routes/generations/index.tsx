import { getGenerationQuery } from "@/api/pokemon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/generations/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getGenerationQuery()),
  component: GenerationsComponent,
});

function GenerationsComponent() {
  const { data } = useSuspenseQuery(getGenerationQuery());

  return (
    <div className="reveal mx-auto max-w-4xl px-6 pt-12">
      <Card className="border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl">
            Game Generations
          </CardTitle>
          <CardDescription className="text-sm">
            Use the links below to navigate to different generations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col gap-2.5">
              {data.results?.map((gen, index) => {
                const delay = (gen.name.length % 12) * 20;
                const genName = gen.name.replace("generation-", "Game Gen ").toUpperCase();
                return (
                  <div
                    key={gen.name}
                    className="reveal-stagger"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link
                        to={`/generations/$generationId`}
                        params={{
                          generationId: `${index + 1}`,
                        }}
                      >
                        <span>{genName}</span>
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
