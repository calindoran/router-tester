import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="sticky top-0 z-40 pt-5 pb-3 px-4">
			<div className="relative mx-auto flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-2xl border border-white/20 backdrop-blur-lg saturate-125 shadow-[0_8px_40px_rgba(2,6,23,0.3)]">
				<Link to=".." data-label="Home">
					<span>Home</span>
				</Link>
				<a
					href="https://pokeapi.co"
					target="_blank"
					rel="noreferrer"
					data-label="PokeAPI"
				>
					<span>PokeAPI</span>
				</a>
			</div>
		</header>
	);
}
