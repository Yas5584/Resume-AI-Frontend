import { redirect } from "next/navigation";

/**
 * Whop App Experience entry point (`/app`).
 * Whop loads this path by default when embedding apps inside the Whop Hub/Dashboard.
 * Automatically forwards to `/dashboard` (or `/login` if unauthenticated).
 */
export default function AppPage() {
  redirect("/dashboard");
}
