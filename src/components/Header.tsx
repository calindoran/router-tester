import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="dock-header">
			<div className="dock-frame">
				<Link
					to="/"
					className="dock-item"
					data-label="Home"
					search={() => ({})}
				>
					<span>Home</span>
				</Link>
				<a
					href="https://pokeapi.co"
					target="_blank"
					rel="noreferrer"
					className="dock-item"
					data-label="PokeAPI"
				>
					<span>PokeAPI</span>
				</a>
			</div>
		</header>
	);
}
