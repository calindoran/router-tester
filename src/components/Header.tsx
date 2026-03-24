import { useAuth } from "@/auth/AuthProvider";
import { Link, UseNavigateResult, useRouter } from "@tanstack/react-router";

export default function Header({ navigate }: { navigate: UseNavigateResult<"/"> }) {
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: "/" });
        });
      });
    }
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-5 pb-3">
      <div className="relative mx-auto flex items-center justify-between gap-3 rounded-2xl border border-white/20 px-3.5 py-2.5 shadow-[0_8px_40px_rgba(2,6,23,0.3)] saturate-125 backdrop-blur-lg">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" data-label="Home">
            <span>Home</span>
          </Link>
          <Link to="/generations" data-label="Generations">
            Generations
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://pokeapi.co" target="_blank" rel="noreferrer" data-label="PokeAPI">
            <span>PokeAPI</span>
          </a>
          <button type="button" className="hover:underline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
