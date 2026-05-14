import { Spinner } from "@/components/Spinner";
import Dashboard from "@/routes/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <React.Suspense
      fallback={
        <div className="pointer-events-none fixed top-20 left-2">
          <Spinner show={true} />
        </div>
      }
    >
      <Dashboard />
    </React.Suspense>
  );
}
