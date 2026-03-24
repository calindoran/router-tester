import { sleep } from "@/utils/sleep";
import * as React from "react";
import { Login } from "./Login";

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

  if (isBootstrapping) {
    return (
      <AuthContext.Provider value={{ isAuthenticated: false, user: null, login, logout }}>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 bg-linear-to-b sm:px-6 lg:px-8">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white p-8 text-center shadow-xl">
            <p className="text-sm text-gray-500">Loading session...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {isAuthenticated ? (
        <>{children}</>
      ) : preAuthView === "splash" ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 bg-linear-to-b sm:px-6 lg:px-8">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white p-8 text-center shadow-xl">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome to Router Tester</h1>
            <p className="mt-2 text-sm text-gray-600">
              Check out the demo by logging in with any username and selecting a role
            </p>
            <button
              type="button"
              onClick={() => setPreAuthView("login")}
              className="mt-6 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
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
