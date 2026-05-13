import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import React from "react";
import { ArrowRight } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { getAllPokemonQuery, type PokemonRefDto } from "@/api/pokemon";
import GenericDataTable from "@/components/GenericDataTable";
import TablePagination from "@/components/TablePagination";
import ErrorNotification from "@/components/ErrorNotification";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/dashboard/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getAllPokemonQuery(20, 0)),
  component: DashboardComponent,
});

function DashboardComponent() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [filter, setFilter] = React.useState("");
  const debounced = useDebounceCallback(setFilter, 500);

  const { data, refetch, isFetching, error } = useQuery({
    ...getAllPokemonQuery(pageSize, pageIndex * pageSize),
    // !INFO: Preserve the last page while the next page is loading to avoid table flicker
    placeholderData: keepPreviousData,
  });

  const filteredResults = React.useMemo(() => {
    if (!filter) return data?.results ?? [];
    return (data?.results ?? []).filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

  const pageCount = Math.max(1, Math.ceil(filteredResults.length / pageSize));

  const columns: ColumnDef<PokemonRefDto>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (row) => {
          if (!row.getValue()) return null;
          return (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{String(row.getValue()).charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{String(row.getValue()).toUpperCase()}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        accessorKey: "name",
        header: () => <div className="text-right">Actions</div>,
        cell: (row) => {
          const href = `/dashboard/${row.getValue()}`;
          return (
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <Link to={href}>
                <span>View Details</span>
                <ArrowRight />
              </Link>
            </Button>
          );
        },
      },
    ],
    [],
  );

  if (error) return <ErrorNotification error={error} />;
  if (!data) return <ErrorNotification error={new Error("No data found")} />;

  return (
    <main className="reveal mx-auto max-w-4xl px-6 pt-12">
      <Card className="border-border/70 shadow-lg">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Pokédex
            </CardTitle>
            <CardDescription className="mt-1 text-sm">Browse Pokémon (sample list)</CardDescription>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
            <Input
              type="search"
              placeholder="Search Pokémon"
              defaultValue={filter}
              onChange={(e) => debounced(e.target.value)}
              className="w-full sm:w-64"
              aria-label="Search Pokémon"
            />
            <Button onClick={() => refetch()} type="button" variant="outline">
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative border-t pt-6">
          <section className="mt-2 max-h-120 overflow-auto rounded-md border border-border/60">
            <GenericDataTable
              rows={filteredResults}
              columns={columns}
              emptyMessage="No data"
              getCellClassName={(cell) => (cell.column.id === "actions" ? "text-right" : undefined)}
            />
          </section>
          {isFetching && (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-pulse rounded bg-primary/50"
              aria-hidden="true"
            />
          )}
          <TablePagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            onPageIndexChange={setPageIndex}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default DashboardComponent;
