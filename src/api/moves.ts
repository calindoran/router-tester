async function getAllMoves(limit: number, offset: number, signal?: AbortSignal) {
  const res = await fetch(`https://pokeapi.co/api/v2/move?limit=${limit}&offset=${offset}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch moves list: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as MoveListResponse;
  return data;
}

export const getAllMovesQuery = (limit: number, offset: number) => ({
  queryKey: ["moves", { limit, offset }],
  queryFn: ({ signal }: { signal?: AbortSignal }) => getAllMoves(limit, offset, signal),
});

async function getMove(moveId: string, signal?: AbortSignal) {
  const res = await fetch(`https://pokeapi.co/api/v2/move/${moveId}`, { signal });
  if (!res.ok) {
    throw new Error(`Failed to fetch move ${moveId}: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as MoveDto;
  return data;
}

export const getMoveQuery = (moveId: string) => ({
  queryKey: ["move", moveId],
  queryFn: ({ signal }: { signal?: AbortSignal }) => getMove(moveId, signal),
});

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface MoveRefDto extends NamedApiResource {}

export interface MoveListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MoveRefDto[];
}

export interface VerboseEffect {
  effect: string;
  short_effect: string;
  language: NamedApiResource;
}

export interface MoveFlavorText {
  flavor_text: string;
  language: NamedApiResource;
  version_group: NamedApiResource;
}

export interface MoveStatChange {
  change: number;
  stat: NamedApiResource;
}

export interface MoveMetaData {
  ailment: NamedApiResource;
  ailment_chance: number;
  category: NamedApiResource;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  max_hits: number | null;
  max_turns: number | null;
  min_hits: number | null;
  min_turns: number | null;
  stat_chance: number;
}

export interface MoveDto {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number | null;
  priority: number;
  type: NamedApiResource;
  damage_class: NamedApiResource;
  target: NamedApiResource;
  generation: NamedApiResource;
  effect_chance: number | null;
  effect_entries: VerboseEffect[];
  flavor_text_entries: MoveFlavorText[];
  stat_changes: MoveStatChange[];
  meta: MoveMetaData | null;
}
