import { createFileRoute } from "@tanstack/react-router";
import {
	flexRender,
	getCoreRowModel,
	Table,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";

export const Route = createFileRoute("/")({
	validateSearch: () => {},
	loader: async () => {
		return fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
			.then((res) => res.json())
			.then((data) => data.results);
	},
	errorComponent: ({ error }) => (
		<div className="mx-auto max-w-3xl px-6 py-16 text-center text-slate-200">
			<h1 className="text-3xl font-semibold">Error</h1>
			<p className="mt-4 text-slate-400">
				{(error as Error)?.message || "Something went wrong."}
			</p>
		</div>
	),
	component: App,
});

function App() {
	const data = Route.useLoaderData();
	console.log("data", data);

	const columns = React.useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				cell: (row: any) => <span>{row.getValue()}</span>,
			},
			{
				accessorKey: "url",
				header: "Options",
				cell: (row: any) => (
					<>
						{/* new route that opens in a dialog that has the pokemon details */}
					</>
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
			<main className="mx-auto max-w-6xl px-6 py-12">
				<AppTable table={table} />
			</main>
		</div>
	);
}

const AppTable = ({ table }: { table: Table<any> }) => {
	return (
		<section className="mt-8 overflow-hidden shadow-[0_12px_40px_-20px_rgba(15,23,42,0.9)]">
			<div className="overflow-x-auto">
				<table className="min-w-full text-left text-sm ">
					<thead className="text-xs font-semibold uppercase tracking-[0.18em] ">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="border-b border-slate-800">
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="px-6 py-4">
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
									className="px-6 py-12 text-center "
								>
									No data
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="transition-colors hover:bg-slate-900/60"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-6 py-4 ">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};
