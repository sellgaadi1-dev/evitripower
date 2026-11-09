import { createFileRoute } from "@tanstack/react-router";

// GET /api/health → {"ok":true,"database":"connected"} once Neon is connected.
// Also creates the enquiries table if it does not exist yet.
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const { checkDatabase } = await import("@/lib/enquiries.server");
        const database = await checkDatabase();
        const ok = database === "connected";
        return Response.json(
          { ok, database },
          { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
