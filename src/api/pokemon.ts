async function getAllPokemon(limit: number, offset: number) {
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
	)
		.then((res) => res.json())
		.then((data) => data.results as PokemonRefDto[]);
	return response;
}

export const getAllPokemonQuery = (limit: number, offset: number) => ({
	queryKey: [limit, offset],
	queryFn: () => getAllPokemon(limit, offset),
});

async function getPokemon(name: string) {
	const response = fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
		.then((res) => res.json())
		.then((data) => data as PokemonDto);
	return response;
}

export const getPokemonQuery = (name: string) => ({
	queryKey: [name],
	queryFn: () => getPokemon(name),
});

export interface PokemonRefDto {
	name: string;
	url: string;
}

export interface PokemonDto {
	abilities: AbilitySlot[];
	base_experience: number;
	cries: Cries;
	forms: NamedAPIResource[];
	game_indices: GameIndex[];
	height: number;
	held_items: any[]; // can be expanded if structure known
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: MoveEntry[];
	name: string;
	order: number;
	past_abilities: PastAbility[];
	past_stats: PastStat[];
	past_types: any[]; // empty in sample; expand if needed
	species: NamedAPIResource;
	sprites: Sprites;
	stats: StatEntry[];
	types: TypeSlot[];
	weight: number;
}

/* Basic named resource */
export interface NamedAPIResource {
	name: string;
	url: string;
}

/* Abilities */
export interface AbilitySlot {
	ability: NamedAPIResource;
	is_hidden: boolean;
	slot: number;
}

export interface PastAbility {
	abilities: (
		| AbilitySlot
		| { ability: null; is_hidden: boolean; slot: number }
	)[];
	generation: NamedAPIResource;
}

/* Game indices */
export interface GameIndex {
	game_index: number;
	version: NamedAPIResource;
}

/* Moves */
export interface MoveEntry {
	move: NamedAPIResource;
	version_group_details: MoveVersionDetail[];
}

export interface MoveVersionDetail {
	level_learned_at: number;
	move_learn_method: NamedAPIResource;
	order: number | null;
	version_group: NamedAPIResource;
}

/* Cries */
export interface Cries {
	latest?: string;
	legacy?: string;
}

/* Stats */
export interface StatEntry {
	base_stat: number;
	effort: number;
	stat: NamedAPIResource;
}

export interface PastStat {
	generation: NamedAPIResource;
	stats: {
		base_stat: number;
		effort: number;
		stat: NamedAPIResource;
	}[];
}

/* Types */
export interface TypeSlot {
	slot: number;
	type: NamedAPIResource;
}

/* Sprites /
/ Generic sprite variant where many generation-specific variants exist */
export interface SpriteVariant {
	back_default?: string | null;
	back_female?: string | null;
	back_shiny?: string | null;
	back_shiny_female?: string | null;
	front_default?: string | null;
	front_female?: string | null;
	front_shiny?: string | null;
	front_shiny_female?: string | null;
	// Some generation entries include other variant keys like "back_gray", "front_transparent" etc.
	[key: string]: string | null | undefined;
}

export interface Sprites {
	back_default: string | null;
	back_female: string | null;
	back_shiny: string | null;
	back_shiny_female: string | null;
	front_default: string | null;
	front_female: string | null;
	front_shiny: string | null;
	front_shiny_female: string | null;
	other?: {
		dream_world?: {
			front_default?: string | null;
			front_female?: string | null;
		} & Record<string, any>;
		home?: {
			front_default?: string | null;
			front_female?: string | null;
			front_shiny?: string | null;
			front_shiny_female?: string | null;
		} & Record<string, any>;
		"official-artwork"?: {
			front_default?: string | null;
			front_shiny?: string | null;
		} & Record<string, any>;
		showdown?: SpriteVariant & Record<string, any>;
		[key: string]: any;
	};
	versions?:
		| {
				// generation keys (generation-i, generation-ii, ...) map to objects whose keys are version names
				[generation: string]: {
					[versionName: string]:
						| SpriteVariant
						| { animated?: SpriteVariant }
						| any;
				};
		  }
		| any;
}
