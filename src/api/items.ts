async function getAllItems(limit: number, offset: number, signal?: AbortSignal) {
  const res = await fetch(`https://pokeapi.co/api/v2/item?limit=${limit}&offset=${offset}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch items list: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as ItemListResponse;
  return data;
}

export const getAllItemsQuery = (limit: number, offset: number) => ({
  queryKey: ["items", { limit, offset }],
  queryFn: ({ signal }: { signal?: AbortSignal }) => getAllItems(limit, offset, signal),
});

async function getItem(itemId: string, signal?: AbortSignal) {
  const res = await fetch(`https://pokeapi.co/api/v2/item/${itemId}`, { signal });
  if (!res.ok) {
    throw new Error(`Failed to fetch item ${itemId}: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as ItemDto;
  return data;
}

export const getItemQuery = (itemId: string) => ({
  queryKey: ["item", itemId],
  queryFn: ({ signal }: { signal?: AbortSignal }) => getItem(itemId, signal),
});

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface ItemRefDto extends NamedApiResource {}

export interface ItemListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ItemRefDto[];
}

export interface VerboseEffect {
  effect: string;
  short_effect: string;
  language: NamedApiResource;
}

export interface VersionGroupFlavorText {
  text: string;
  language: NamedApiResource;
  version_group: NamedApiResource;
}

export interface ItemHolderPokemonVersionDetail {
  rarity: number;
  version: NamedApiResource;
}

export interface ItemHolderPokemon {
  pokemon: NamedApiResource;
  version_details: ItemHolderPokemonVersionDetail[];
}

export interface ItemName {
  language: NamedApiResource;
  name: string;
}

export interface ItemSprite {
  default: string | null;
}

export interface ItemDto {
  id: number;
  name: string;
  cost: number;
  fling_power: number | null;
  fling_effect: NamedApiResource | null;
  attributes: NamedApiResource[];
  category: NamedApiResource;
  effect_entries: VerboseEffect[];
  flavor_text_entries: VersionGroupFlavorText[];
  game_indices: { game_index: number; generation: NamedApiResource }[];
  names: ItemName[];
  sprites: ItemSprite;
  held_by_pokemon: ItemHolderPokemon[];
  baby_trigger_for: NamedApiResource | null;
}
