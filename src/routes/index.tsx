import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { useDebounceCallback } from "usehooks-ts";
import ErrorNotification from "@/components/ErrorNotification";
import { getAllPokemonQuery, type PokemonRefDto } from "../api/pokemon";

export const Route = createFileRoute("/")({
	loader: (options) =>
		options.context.queryClient.ensureQueryData(getAllPokemonQuery(20, 0)),
	component: App,
});

function App() {
	const [pageIndex, setPageIndex] = React.useState(0);
	const [pageSize, setPageSize] = React.useState(20);
	const [filter, setFilter] = React.useState("");
	const debounced = useDebounceCallback(setFilter, 500);

	const { data, refetch, isFetching } = useSuspenseQuery(
		getAllPokemonQuery(pageSize, pageIndex * pageSize),
	);

	const filteredResults = React.useMemo(() => {
		if (!filter) return data?.results ?? [];
		return (data?.results ?? []).filter((p) =>
			p.name.toLowerCase().includes(filter.toLowerCase()),
		);
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
							<div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center text-sm font-semibold text-slate-700">
								{String(row.getValue()).charAt(0).toUpperCase()}
							</div>
							<div className="text-sm font-medium">
								{String(row.getValue()).toUpperCase()}
							</div>
						</div>
					);
				},
			},
			{
				id: "actions",
				accessorKey: "name",
				header: "Actions",
				cell: (row) => {
					const href = `/${row.getValue()}`;
					return (
						<Link
							to={href}
							className="text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm"
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
			<div className="bg-linear-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg overflow-hidden">
				<div className="p-6 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight">Pokédex</h1>
						<p className="mt-1 text-sm text-gray-600">
							Browse Pokémon (sample list)
						</p>
					</div>
					{/* Placeholder for a global action */}
					<div className="flex items-center gap-3">
						<input
							type="search"
							placeholder="Search Pokémon"
							defaultValue={filter}
							onChange={(e) => debounced(e.target.value)}
							className="w-64 text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
							aria-label="Search Pokémon"
						/>
						<button
							onClick={() => refetch()}
							className="text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm"
							type="button"
						>
							Refresh
						</button>
					</div>
				</div>

				<div className="p-6 border-t bg-white/30">
					<section className="mt-2 overflow-y-auto max-h-120">
						<div className="overflow-x-auto">
							<table className="min-w-full text-left text-sm">
								<thead className="text-xs font-semibold uppercase tracking-[0.12em]">
									{table.getHeaderGroups().map((headerGroup) => (
										<tr
											key={headerGroup.id}
											className="border-b border-slate-800"
										>
											{headerGroup.headers.map((header) => (
												<th key={header.id} className="px-6 py-3">
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
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
												<tr
													key={row.id}
													className="transition-colors hover:bg-slate-900/60"
												>
													{row.getVisibleCells().map((cell) => {
														const isActionsCell = cell.column.id === "actions";

														return (
															<td
																key={cell.id}
																className="px-6 py-4 align-middle"
															>
																{isActionsCell ? (
																	flexRender(
																		cell.column.columnDef.cell,
																		cell.getContext(),
																	)
																) : (
																	<Link
																		to={href}
																		className="block w-full h-full cursor-pointer"
																	>
																		{flexRender(
																			cell.column.columnDef.cell,
																			cell.getContext(),
																		)}
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
					<div className="flex items-center justify-between gap-4 mt-4">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
								disabled={pageIndex === 0}
								className="px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm disabled:opacity-50"
							>
								Previous
							</button>
							<button
								type="button"
								onClick={() => setPageIndex((p) => p + 1)}
								disabled={pageIndex + 1 >= Math.ceil(data.count / pageSize)}
								className="px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm disabled:opacity-50"
							>
								Next
							</button>
							<span className="text-sm text-gray-600 ml-3">
								Page {pageIndex + 1} of {Math.ceil(data.count / pageSize)}
								{isFetching ? " (loading...)" : ""}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<label className="text-sm text-gray-600" htmlFor="rows-per-page">
								Rows:
							</label>
							<select
								id="rows-per-page"
								value={pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));
									setPageIndex(0);
								}}
								className="px-2 py-1 rounded"
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

export default App;
