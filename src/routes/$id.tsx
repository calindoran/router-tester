import { createFileRoute, Link } from "@tanstack/react-router";
import type { PokemonDto } from "../api/pokemon";

export const Route = createFileRoute("/$id")({
	loader: async ({ params }) => {
		return fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
			.then((res) => res.json())
			.then((data) => data as PokemonDto);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();
	if (!data) return <div className="p-6">Loading...</div>;

	const {
		id,
		name,
		sprites,
		types = [],
		abilities = [],
		stats = [],
		height,
		weight,
	} = data;

	const displayName = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
	const artwork =
		sprites?.other?.["official-artwork"]?.front_default ||
		sprites?.front_default;

	const typeColors: Record<string, string> = {
		fire: "bg-red-400/90",
		water: "bg-blue-400/90",
		grass: "bg-green-400/90",
		electric: "bg-yellow-300/90",
		rock: "bg-stone-400/90",
		ground: "bg-amber-300/90",
		psychic: "bg-pink-300/90",
		ice: "bg-cyan-200/90",
		dragon: "bg-indigo-500/90",
		dark: "bg-gray-700/90",
		ghost: "bg-violet-700/90",
		steel: "bg-slate-400/90",
		normal: "bg-zinc-300/90",
		poison: "bg-violet-400/90",
		fairy: "bg-pink-200/90",
		bug: "bg-lime-400/90",
		fighting: "bg-orange-500/90",
		flying: "bg-sky-200/90",
	};

	const statPct = (v: number) => Math.min(100, Math.round((v / 255) * 100));

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg overflow-hidden">
				<div className="flex flex-col md:flex-row items-center gap-6 p-6">
					{/* Artwork */}
					<div className="w-48 h-48 flex-shrink-0 flex items-center justify-center bg-white/60 rounded-xl shadow-inner">
						{artwork ? (
							<img
								src={artwork}
								alt={name}
								className="w-40 h-40 object-contain drop-shadow-sm"
							/>
						) : (
							<div className="text-sm text-gray-500">No image</div>
						)}
					</div>

					{/* Header & badges */}
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-extrabold tracking-tight">
									{displayName(name)}{" "}
									<span className="text-gray-500">#{id}</span>
								</h1>
								<div className="mt-2 flex items-center gap-2">
									<span className="text-sm text-gray-600">
										Height: {(height ?? 0) / 10} m
									</span>
									<span className="text-sm text-gray-600">•</span>
									<span className="text-sm text-gray-600">
										Weight: {(weight ?? 0) / 10} kg
									</span>
								</div>
							</div>
							<Link
								to={".."}
								className="text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-full shadow-sm"
							>
								Back
							</Link>
						</div>

						{/* Types */}
						<div className="mt-4 flex gap-2 flex-wrap">
							{types.map((t) => {
								const typeName = t.type.name;
								const bg = typeColors[typeName] ?? "bg-gray-300";
								return (
									<span
										key={typeName}
										className={`${bg} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}
									>
										{displayName(typeName)}
									</span>
								);
							})}
						</div>

						{/* Abilities */}
						<div className="mt-4">
							<h3 className="text-sm font-semibold text-gray-700">Abilities</h3>
							<div className="mt-2 flex flex-wrap gap-2">
								{abilities.map((a) => (
									<span
										key={a.ability.name}
										className="text-xs px-2 py-1 bg-white/60 rounded-full border"
										title={a.ability.name}
									>
										{displayName(a.ability.name.replace("-", " "))}
										{a.is_hidden ? " (Hidden)" : ""}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="p-6 border-t bg-white/30">
					<h3 className="text-sm font-semibold text-gray-700 mb-4">
						Base Stats
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{stats.map((s) => (
							<div key={s.stat.name} className="flex items-center gap-4">
								<div className="w-28 text-xs text-gray-600">
									{displayName(s.stat.name.replace("-", " "))}
								</div>
								<div className="flex-1">
									<div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-green-400 to-lime-400"
											style={{ width: `${statPct(s.base_stat)}%` }}
										/>
									</div>
								</div>
								<div className="w-12 text-right text-sm font-mono text-gray-700">
									{s.base_stat}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
