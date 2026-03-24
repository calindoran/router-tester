import { createFileRoute } from "@tanstack/react-router";
import React from "react";

const DashboardLazy = React.lazy(() => import("@/routes/dashboard"));

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <DashboardLazy />
    </React.Suspense>
  );
}
