import * as React from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDebounceCallback } from "usehooks-ts";
import { getAllMovesQuery, getMoveQuery } from "@/api/moves";
import ErrorNotification from "@/components/ErrorNotification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/moves/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getAllMovesQuery(5000, 0)),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [filter, setFilter] = React.useState("");
  const rowsPerPageId = React.useId();
  const debounced = useDebounceCallback(setFilter, 350);

  const { data, error, isFetching, refetch } = useQuery({
    ...getAllMovesQuery(5000, 0),
  });

  const filteredRows = React.useMemo(() => {
    if (!data?.results) return [];
    if (!filter) return data.results;
    const needle = filter.toLowerCase();
    return data.results.filter((move) => move.name.toLowerCase().includes(needle));
  }, [data?.results, filter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  const visibleRows = React.useMemo(() => {
    const start = safePageIndex * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageSize, safePageIndex]);

  const detailQueries = useQueries({
    queries: visibleRows.map((move) => ({
      ...getMoveQuery(move.name),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const detailsByName = React.useMemo(() => {
    const map = new Map<
      string,
      {
        type: string;
        power: number | null;
        accuracy: number | null;
        damageClass: string;
      }
    >();

    visibleRows.forEach((move, index) => {
      const detail = detailQueries[index]?.data;
      if (!detail) return;
      map.set(move.name, {
        type: detail.type.name,
        power: detail.power,
        accuracy: detail.accuracy,
        damageClass: detail.damage_class.name,
      });
    });

    return map;
  }, [visibleRows, detailQueries]);

  if (error) return <ErrorNotification error={error} />;
  if (!data) return <ErrorNotification error={new Error("No move data found")} />;

  const toMovePage = (name: string) => {
    navigate({
      to: "/moves/$moveId",
      params: { moveId: name },
    });
  };

  return (
    <main className="reveal mx-auto max-w-4xl px-6 pt-12">
      <Card className="border-border/70 shadow-lg">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Move Catalog
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Browse and search PokeAPI moves. Select any row to view full move details.
            </CardDescription>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
            <Input
              type="search"
              placeholder="Search moves"
              defaultValue={filter}
              onChange={(e) => debounced(e.target.value)}
              className="w-full sm:w-64"
              aria-label="Search moves"
            />
            <Button onClick={() => refetch()} type="button" variant="outline">
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative border-t pt-6">
          <section className="mt-2 max-h-120 overflow-auto rounded-md border border-border/60">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="border-b border-border">Move</TableHead>
                  <TableHead className="border-b border-border">Type</TableHead>
                  <TableHead className="border-b border-border text-right">Power</TableHead>
                  <TableHead className="border-b border-border text-right">Accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No moves found</TableCell>
                  </TableRow>
                ) : (
                  visibleRows.map((move) => {
                    const details = detailsByName.get(move.name);
                    const displayName = move.name.replaceAll("-", " ").toUpperCase();
                    return (
                      <TableRow
                        key={move.name}
                        tabIndex={0}
                        className="cursor-pointer"
                        onClick={() => toMovePage(move.name)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toMovePage(move.name);
                          }
                        }}
                        aria-label={`View move details for ${move.name}`}
                      >
                        <TableCell>
                          <div className="text-sm font-medium">{displayName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-muted/30 capitalize">
                            {details?.type ?? "Loading"}
                          </Badge>
                          {details?.damageClass ? (
                            <Badge variant="secondary" className="ml-2 capitalize">
                              {details.damageClass}
                            </Badge>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {typeof details?.power === "number" ? details.power : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {typeof details?.accuracy === "number" ? `${details.accuracy}%` : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </section>

          {isFetching && (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-pulse rounded bg-primary/50"
              aria-hidden="true"
            />
          )}

          <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={safePageIndex === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePageIndex + 1 >= pageCount}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
              <Badge variant="outline" className="ml-1 sm:ml-3">
                Page {safePageIndex + 1} of {pageCount}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground" htmlFor={rowsPerPageId}>
                Rows:
              </label>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger id={rowsPerPageId} className="w-20">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
