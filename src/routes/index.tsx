import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async () => {
    throw redirect({ to: "/pemilu/$dapilType", params: { dapilType: "dpd" } });
  },
});

function HomePage() {
  return <div></div>;
}
