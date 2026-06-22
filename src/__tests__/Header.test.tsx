// @vitest-environment jsdom

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect } from "vite-plus/test";

// Mock auth hook so Header can be tested in isolation
const logoutMock = vi.fn(() => Promise.resolve());
vi.mock("../auth/AuthProvider", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    logout: logoutMock,
    user: { username: "bob", role: "user" },
  }),
}));

// Mock TanStack Router exports used by Header
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useRouter: () => ({ invalidate: () => Promise.resolve() }),
}));

import Header from "../components/Header";

test("Header shows confirm dialog and calls logout + navigate on confirm", async () => {
  const navigateMock = vi.fn();

  render(<Header navigate={navigateMock as any} />);

  // Click logout to open confirm dialog
  fireEvent.click(screen.getByText("Logout"));

  expect(screen.getByText("Are you sure you want to logout?")).toBeTruthy();

  // Confirm
  fireEvent.click(screen.getByText("Confirm"));

  await waitFor(() => expect(logoutMock).toHaveBeenCalled());
  expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
});
