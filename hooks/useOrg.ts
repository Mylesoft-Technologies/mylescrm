"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// In a real implementation the orgId would come from the WorkOS session
// and be resolved server-side. This hook provides the org context to client components.
// For now we use a placeholder pattern — replace with real session lookup.

export function useOrg(orgId?: Id<"organizations">) {
  const org = useQuery(
    api.organizations.getById,
    orgId ? { orgId } : "skip"
  );
  return org;
}

export function useCurrentUser(workosUserId?: string) {
  const user = useQuery(
    api.organizations.getUser,
    workosUserId ? { workosUserId } : "skip"
  );
  return user;
}
