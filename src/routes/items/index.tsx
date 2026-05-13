import * as React from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { useDebounceCallback } from "usehooks-ts";
import { getAllItemsQuery, getItemQuery } from "@/api/items";
import GenericDataTable from "@/components/GenericDataTable";
import TablePagination from "@/components/TablePagination";
import ErrorNotification from "@/components/ErrorNotification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/items/")({
  loader: (options) => options.context.queryClient.ensureQueryData(getAllItemsQuery(5000, 0)),
  component: RouteComponent,
});

type ItemRow = {
  name: string;
  url: string;
};

type ItemDetails = {
  sprite: string | null;
  category: string;
  cost: number;
};

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [filter, setFilter] = React.useState("");
  const debounced = useDebounceCallback(setFilter, 350);

  const { data, error, isFetching, refetch } = useQuery({
    ...getAllItemsQuery(5000, 0),
  });

  const filteredRows = React.useMemo(() => {
    if (!data?.results) return [];
    if (!filter) return data.results;
    const needle = filter.toLowerCase();
    return data.results.filter((item) => item.name.toLowerCase().includes(needle));
  }, [data?.results, filter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  const visibleRows = React.useMemo(() => {
    const start = safePageIndex * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageSize, safePageIndex]);

  const detailQueries = useQueries({
    queries: visibleRows.map((item) => ({
      ...getItemQuery(item.name),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const detailsByName = React.useMemo(() => {
    const map = new Map<string, ItemDetails>();
    visibleRows.forEach((item, index) => {
      const detail = detailQueries[index]?.data;
      if (!detail) return;
      map.set(item.name, {
        sprite: detail.sprites.default,
        category: detail.category.name,
        cost: detail.cost,
      });
    });
    return map;
  }, [visibleRows, detailQueries]);

  if (error) return <ErrorNotification error={error} />;
  if (!data) return <ErrorNotification error={new Error("No item data found")} />;

  const toItemPage = (name: string) => {
    navigate({
      to: "/items/$itemId",
      params: { itemId: name },
    });
  };

  const columns: ColumnDef<ItemRow>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Item",
        cell: ({ row }) => {
          const details = detailsByName.get(row.original.name);
          const displayName = row.original.name.replaceAll("-", " ").toUpperCase();
          return (
            <div className="flex items-center gap-3">
              <Avatar>
                {details?.sprite ? (
                  <AvatarImage src={details.sprite} alt={`${row.original.name} sprite`} />
                ) : null}
                <AvatarFallback>{row.original.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{displayName}</div>
            </div>
          );
        },
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => {
          const details = detailsByName.get(row.original.name);
          return (
            <Badge variant="outline" className="bg-muted/30">
              {details?.category ?? "Loading"}
            </Badge>
          );
        },
      },
      {
        id: "cost",
        header: () => <div className="text-right">Cost</div>,
        cell: ({ row }) => {
          const details = detailsByName.get(row.original.name);
          return (
            <div className="text-right font-mono text-sm">
              {typeof details?.cost === "number" ? details.cost.toLocaleString() : "..."}
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
              Item Catalog
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Browse and search PokeAPI items. Select any row to view full item details.
            </CardDescription>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
            <Input
              type="search"
              placeholder="Search items"
              defaultValue={filter}
              onChange={(e) => debounced(e.target.value)}
              className="w-full sm:w-64"
              aria-label="Search items"
            />
            <Button onClick={() => refetch()} type="button" variant="outline">
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative border-t pt-6">
          <section className="mt-2 max-h-120 overflow-auto rounded-md border border-border/60">
            <GenericDataTable
              rows={visibleRows}
              columns={columns}
              emptyMessage="No items found"
              onRowActivate={(row) => toItemPage(row.name)}
              getRowAriaLabel={(row) => `View item details for ${row.name}`}
            />
          </section>
          {isFetching && (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-pulse rounded bg-primary/50"
              aria-hidden="true"
            />
          )}
          <TablePagination
            pageIndex={safePageIndex}
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
