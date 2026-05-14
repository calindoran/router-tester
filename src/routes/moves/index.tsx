import { getAllMovesQuery, getMoveQuery } from "@/api/moves";
import ErrorNotification from "@/components/ErrorNotification";
import GenericDataTable from "@/components/GenericDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { useDebounceCallback } from "usehooks-ts";

export const Route = createFileRoute("/moves/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getAllMovesQuery(20, 0)),
  component: RouteComponent,
});

type MoveRow = {
  name: string;
  url: string;
};

type MoveDetails = {
  type: string;
  power: number | null;
  accuracy: number | null;
  damageClass: string;
};

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [filter, setFilter] = React.useState("");
  const debounced = useDebounceCallback(setFilter, 350);
  const { data, error, isFetching, refetch } = useQuery({
    ...getAllMovesQuery(20, 0),
  });

  const filteredRows = React.useMemo(() => {
    if (!data?.results) return [];
    if (!filter) return data.results;
    const filterItem = filter.toLowerCase();
    return data.results.filter((move) => move.name.toLowerCase().includes(filterItem));
  }, [data?.results, filter]);

  const detailQueries = useQueries({
    queries: filteredRows.map((move) => ({
      ...getMoveQuery(move.name),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const detailsByName = React.useMemo(() => {
    const map = new Map<string, MoveDetails>();

    filteredRows.forEach((move, index) => {
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
  }, [filteredRows, detailQueries]);

  if (error) return <ErrorNotification error={error} />;
  if (!data) return <ErrorNotification error={new Error("No move data found")} />;

  const toMovePage = (name: string) => {
    navigate({
      to: "/moves/$moveId",
      params: { moveId: name },
    });
  };

  const columns: ColumnDef<MoveRow>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Move",
        cell: ({ row }) => {
          const displayName = row.original.name.replaceAll("-", " ").toUpperCase();
          return <div className="text-sm font-medium">{displayName}</div>;
        },
      },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => {
          const details = detailsByName.get(row.original.name);
          return (
            <>
              <Badge variant="outline" className="bg-muted/30 capitalize">
                {details?.type ?? "Loading"}
              </Badge>
              {details?.damageClass ? (
                <Badge variant="secondary" className="ml-2 capitalize">
                  {details.damageClass}
                </Badge>
              ) : null}
            </>
          );
        },
      },
      {
        id: "power",
        header: () => <div className="text-right">Power</div>,
        cell: ({ row }) => {
          const details = detailsByName.get(row.original.name);
          return (
            <div className="text-right font-mono text-sm">
              {typeof details?.power === "number" ? details.power : "-"}
            </div>
          );
        },
      },
      {
        id: "accuracy",
        header: () => <div className="text-right">Accuracy</div>,
        cell: ({ row }) => {
          const details = detailsByName.get(row.original.name);
          return (
            <div className="text-right font-mono text-sm">
              {typeof details?.accuracy === "number" ? `${details.accuracy}%` : "-"}
            </div>
          );
        },
      },
    ],
    [detailsByName],
  );

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
          <GenericDataTable
            rows={filteredRows}
            columns={columns}
            emptyMessage="No moves found"
            onRowActivate={(row) => toMovePage(row.name)}
            getRowAriaLabel={(row) => `View move details for ${row.name}`}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>
    </main>
  );
}
