import { getAllPokemonQuery, type PokemonRefDto } from "@/api/pokemon";
import ErrorNotification from "@/components/ErrorNotification";
import GenericDataTable from "@/components/GenericDataTable";
import TablePagination from "@/components/TablePagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useDebounceCallback } from "usehooks-ts";

export const Route = createFileRoute("/dashboard/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getAllPokemonQuery(20, 0)),
  component: DashboardComponent,
});

function DashboardComponent() {
  const navigate = Route.useNavigate();
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [filter, setFilter] = React.useState("");
  const debounced = useDebounceCallback(setFilter, 500);

  const { data, refetch, isFetching, error } = useQuery({
    ...getAllPokemonQuery(pageSize, pageIndex * pageSize),
    placeholderData: keepPreviousData,
  });

  const filteredResults = React.useMemo(() => {
    if (!filter) return data?.results ?? [];
    if (!data?.results) return [];
    return data.results.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

  const pageCount = Math.max(1, Math.ceil((data?.count ?? 0) / pageSize));

  if (error) return <ErrorNotification error={error} />;
  if (!data) return <ErrorNotification error={new Error("No data found")} />;

  const toDashboardPage = (name: string) => {
    navigate({
      to: "/dashboard/$id",
      params: { id: name },
    });
  };

  const columns: ColumnDef<PokemonRefDto>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (row) => {
          if (!row.getValue()) return null;
          const rowValue = row.getValue<string>();
          const name = typeof rowValue === "string" ? rowValue : "";
          return (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{name.toUpperCase()}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        accessorKey: "name",
        header: () => <div className="text-right">Actions</div>,
        cell: (row) => {
          const rowValue = row.getValue<string>();
          const name = typeof rowValue === "string" ? rowValue : "";
          const href = `/dashboard/${name}`;
          return (
            <div className="text-right">
              <Button asChild size="sm" variant="outline" className="ml-auto">
                <Link to={href}>
                  <span>View Details</span>
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <main className="reveal mx-auto max-w-4xl px-6 pt-12">
      <Card className="border-border/70 shadow-lg">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Pokédex
            </CardTitle>
            <CardDescription className="mt-1 text-sm">Browse Pokémon and view their details.</CardDescription>
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
          <GenericDataTable
            rows={filteredResults}
            columns={columns}
            emptyMessage="No data"
            onRowActivate={(row) => toDashboardPage(row.name)}
            getRowAriaLabel={(row) => `View Pokémon details for ${row.name}`}
            isFetching={isFetching}
          />
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
