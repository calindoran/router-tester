import { sleep } from "@/utils/sleep";
import * as React from "react";
import { Login } from "./Login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PreAuthView = "splash" | "login";

export interface User {
  username: string;
  role: "user" | "admin";
}

export interface AuthContext {
  isAuthenticated: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = "auth.user";

function getStoredUser() {
  const stored = localStorage.getItem(key);
  return stored ? (JSON.parse(stored) as User) : null;
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(key, JSON.stringify(user));
  } else {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = React.useState(true);
  const [preAuthView, setPreAuthView] = React.useState<PreAuthView>("splash");
  const isAuthenticated = !!user;

  const logout = React.useCallback(async () => {
    await sleep(250);

    setStoredUser(null);
    setUser(null);
    setPreAuthView("splash");
  }, []);

  const login = React.useCallback(async (user: User) => {
    await sleep(500);

    setStoredUser(user);
    setUser(user);
  }, []);

  React.useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsBootstrapping(false);
  }, []);

  const splashShell = (content: React.ReactNode) => (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/40 to-accent/10 px-4 sm:px-6 lg:px-8">
      <Card className="reveal w-full max-w-md border-border/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome to Router Tester
          </CardTitle>
          <CardDescription className="text-sm">
            Check out the demo by logging in with any username and selecting a role.
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </div>
  );

  if (isBootstrapping) {
    return (
      <AuthContext.Provider value={{ isAuthenticated: false, user: null, login, logout }}>
        {splashShell(<p className="text-sm text-muted-foreground">Loading session...</p>)}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {isAuthenticated ? (
        <>{children}</>
      ) : preAuthView === "splash" ? (
        splashShell(
          <Button type="button" onClick={() => setPreAuthView("login")} className="mt-6 w-full">
            Login
          </Button>,
        )
      ) : (
        <Login />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
