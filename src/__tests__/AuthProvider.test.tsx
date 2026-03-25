// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { test, expect } from "vitest";
import { AuthProvider, useAuth } from "../auth/AuthProvider";

function ShowUser() {
  const auth = useAuth();
  return <div>{auth.user?.username ?? "no-user"}</div>;
}

test("AuthProvider reads stored user from localStorage and provides it to children", async () => {
  localStorage.setItem("auth.user", JSON.stringify({ username: "alice", role: "user" }));

  render(
    <AuthProvider>
      <ShowUser />
    </AuthProvider>,
  );

  await waitFor(() => expect(screen.getByText("alice")).toBeTruthy());
});
