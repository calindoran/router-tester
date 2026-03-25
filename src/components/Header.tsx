import * as React from "react";
import { useAuth } from "@/auth/AuthProvider";
import { Link, UseNavigateResult, useRouter } from "@tanstack/react-router";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Header({ navigate }: { navigate: UseNavigateResult<"/"> }) {
  const router = useRouter();
  const auth = useAuth();
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleLogoutConfirm = async () => {
    setShowConfirm(false);
    try {
      await auth.logout();
      await router.invalidate();
      navigate({ to: "/" });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 px-4 pt-5 pb-3">
        <div className="relative mx-auto flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 px-3.5 py-2.5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard" data-label="Home">
                <span>Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/generations" data-label="Generations">
                Generations
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="capitalize">
              {auth.user?.role ?? "user"}
            </Badge>
            <Avatar size="sm">
              <AvatarFallback>
                {auth.user?.username?.slice(0, 1).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" asChild>
              <a href="https://pokeapi.co" target="_blank" rel="noreferrer" data-label="PokeAPI">
                <span>PokeAPI</span>
              </a>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirm(true)}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={showConfirm}
        title="Logout"
        description="Are you sure you want to logout?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
