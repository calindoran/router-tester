import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { ArrowRight } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { getAllPokemonQuery, type PokemonRefDto } from "@/api/pokemon";
import ErrorNotification from "@/components/ErrorNotification";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/dashboard/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getAllPokemonQuery(20, 0)),
  component: DashboardComponent,
});

function DashboardComponent() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [filter, setFilter] = React.useState("");
  const rowsPerPageId = React.useId();
  const debounced = useDebounceCallback(setFilter, 500);

  const { data, refetch, isFetching } = useSuspenseQuery(
    getAllPokemonQuery(pageSize, pageIndex * pageSize),
  );

  const filteredResults = React.useMemo(() => {
    if (!filter) return data?.results ?? [];
    return (data?.results ?? []).filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));
  }, [data, filter]);

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

  const table = useReactTable({
    data: filteredResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

        <CardContent className="border-t pt-6">
          <section className="mt-2 max-h-120 overflow-auto rounded-md border border-border/60">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="border-b border-border">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length}>No data</TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <TableCell
                              key={cell.id}
                              className={cell.column.id === "actions" ? "text-right" : undefined}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </section>
          <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={pageIndex === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setPageIndex((p) => p + 1)}
                disabled={pageIndex + 1 >= Math.ceil(data.count / pageSize)}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
              <Badge variant="outline" className="ml-1 sm:ml-3">
                Page {pageIndex + 1} of {Math.ceil(data.count / pageSize)}
                {isFetching ? " (loading...)" : ""}
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

export default DashboardComponent;
