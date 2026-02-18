import { createFileRoute } from "@tanstack/react-router";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";
import type { PokemonRefDto } from "../api/pokemon";

export const Route = createFileRoute("/")({
	validateSearch: () => {},
	loader: async () => {
		return fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20")
			.then((res) => res.json())
			.then((data) => data.results as PokemonRefDto[]);
	},
	errorComponent: ({ error }) => (
		<div className="mx-auto max-w-4xl px-6 py-16 text-center">
			<div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg p-8">
				<h1 className="text-3xl font-semibold">Error</h1>
				<p className="mt-4 text-slate-600">
					{(error as Error)?.message || "Something went wrong."}
				</p>
			</div>
		</div>
	),
	component: App,
});

function App() {
	const data = Route.useLoaderData();

	const columns = React.useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				cell: (row: any) => (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center text-sm font-semibold text-slate-700">
							{String(row.getValue()).charAt(0).toUpperCase()}
						</div>
						<div className="text-sm font-medium">
							{row.getValue().toUpperCase()}
						</div>
					</div>
				),
			},
			{
				accessorKey: "name",
				header: "Actions",
				cell: (row: any) => (
					<a
						href={`/${row.getValue()}`}
						className="text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm"
					>
						View Details
					</a>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="min-h-screen">
			<main className="mx-auto max-w-4xl px-6 py-12">
				<div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg overflow-hidden">
					<div className="p-6 flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-extrabold tracking-tight">
								Pokédex
							</h1>
							<p className="mt-1 text-sm text-gray-600">
								Browse Pokémon (sample list)
							</p>
						</div>
						{/* Placeholder for a global action */}
						<button
							className="text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm"
							type="button"
						>
							Refresh
						</button>
					</div>

					<div className="p-6 border-t bg-white/30">
						<section className="mt-2 overflow-hidden">
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
														{row.getVisibleCells().map((cell) => (
															<td
																key={cell.id}
																className="px-6 py-4 align-middle"
															>
																<a href={href} className="block w-full h-full">
																	{flexRender(
																		cell.column.columnDef.cell,
																		cell.getContext(),
																	)}
																</a>
															</td>
														))}
													</tr>
												);
											})
										)}
									</tbody>
								</table>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
