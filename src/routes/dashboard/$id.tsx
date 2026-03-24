import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getPokemonQuery } from "@/api/pokemon";

export const Route = createFileRoute("/dashboard/$id")({
  loader: (options) =>
    options.context.queryClient.ensureQueryData(getPokemonQuery(options.params.id)),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(getPokemonQuery(params.id));

  const { id, name, sprites, types = [], abilities = [], stats = [], height, weight } = data;

  const displayName = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const artwork = sprites?.other?.["official-artwork"]?.front_default || sprites?.front_default;

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
    <div className="mx-auto max-w-4xl px-6 pt-12">
      <div className="overflow-hidden rounded-2xl bg-linear-to-br from-indigo-50 to-pink-50 shadow-lg">
        <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
          {/* Artwork */}
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-xl bg-white/60 shadow-inner">
            {artwork ? (
              <img src={artwork} alt={name} className="h-40 w-40 object-contain drop-shadow-sm" />
            ) : (
              <div className="text-sm text-gray-500">No image</div>
            )}
          </div>

          {/* Header & badges */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {displayName(name)} <span className="text-gray-500">#{id}</span>
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Height: {(height ?? 0) / 10} m</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">Weight: {(weight ?? 0) / 10} kg</span>
                </div>
              </div>
              <Link
                to={".."}
                className="rounded-full bg-white/70 px-3 py-1 text-sm shadow-sm hover:bg-white"
              >
                Back
              </Link>
            </div>

            {/* Types */}
            <div className="mt-4 flex flex-wrap gap-2">
              {types.map((t) => {
                const typeName = t.type.name;
                const bg = typeColors[typeName] ?? "bg-gray-300";
                return (
                  <span
                    key={typeName}
                    className={`${bg} rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm`}
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
                    className="rounded-full border bg-white/60 px-2 py-1 text-xs"
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
        <div className="border-t bg-white/30 p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Base Stats</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stats.map((s) => (
              <div key={s.stat.name} className="flex items-center gap-4">
                <div className="w-28 text-xs text-gray-600">
                  {displayName(s.stat.name.replace("-", " "))}
                </div>
                <div className="flex-1">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-linear-to-r from-green-400 to-lime-400"
                      style={{ width: `${statPct(s.base_stat)}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right font-mono text-sm text-gray-700">{s.base_stat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
