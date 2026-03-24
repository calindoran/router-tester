import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { useDebounceCallback } from "usehooks-ts";
import { getAllPokemonQuery, type PokemonRefDto } from "@/api/pokemon";
import ErrorNotification from "@/components/ErrorNotification";

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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-sm font-semibold text-slate-700">
                {String(row.getValue()).charAt(0).toUpperCase()}
              </div>
              <div className="text-sm font-medium">{String(row.getValue()).toUpperCase()}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        accessorKey: "name",
        header: "Actions",
        cell: (row) => {
          const href = `/dashboard/${row.getValue()}`;
          return (
            <Link
              to={href}
              className="rounded-full bg-white/70 px-3 py-1 text-sm shadow-sm hover:bg-white"
            >
              View Details
            </Link>
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
    <main className="mx-auto max-w-4xl px-6 pt-12">
      <div className="overflow-hidden rounded-2xl bg-linear-to-br from-indigo-50 to-pink-50 shadow-lg">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Pokédex</h1>
            <p className="mt-1 text-sm text-gray-600">Browse Pokémon (sample list)</p>
          </div>
          {/* Placeholder for a global action */}
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search Pokémon"
              defaultValue={filter}
              onChange={(e) => debounced(e.target.value)}
              className="w-64 rounded-full bg-white/70 px-3 py-1 text-sm shadow-sm transition placeholder:text-gray-500 hover:bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              aria-label="Search Pokémon"
            />
            <button
              onClick={() => refetch()}
              className="rounded-full bg-white/70 px-3 py-1 text-sm shadow-sm hover:bg-white"
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="border-t bg-white/30 p-6">
          <section className="mt-2 max-h-120 overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs font-semibold tracking-[0.12em] uppercase">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-slate-800">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-6 py-3">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={table.getAllColumns().length}
                        className="px-6 py-12 text-center text-sm"
                      >
                        No data
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => {
                      const href = `/${row.original.name}`;
                      return (
                        <tr key={row.id} className="transition-colors hover:bg-slate-900/60">
                          {row.getVisibleCells().map((cell) => {
                            const isActionsCell = cell.column.id === "actions";

                            return (
                              <td key={cell.id} className="px-6 py-4 align-middle">
                                {isActionsCell ? (
                                  flexRender(cell.column.columnDef.cell, cell.getContext())
                                ) : (
                                  <Link to={href} className="block h-full w-full cursor-pointer">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </Link>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={pageIndex === 0}
                className="rounded-full bg-white/70 px-3 py-1 shadow-sm hover:bg-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPageIndex((p) => p + 1)}
                disabled={pageIndex + 1 >= Math.ceil(data.count / pageSize)}
                className="rounded-full bg-white/70 px-3 py-1 shadow-sm hover:bg-white disabled:opacity-50"
              >
                Next
              </button>
              <span className="ml-3 text-sm text-gray-600">
                Page {pageIndex + 1} of {Math.ceil(data.count / pageSize)}
                {isFetching ? " (loading...)" : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600" htmlFor={rowsPerPageId}>
                Rows:
              </label>
              <select
                id={rowsPerPageId}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
                className="rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardComponent;
