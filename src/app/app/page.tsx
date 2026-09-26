import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = "resumeai_session";

/**
 * Whop App Experience entry point (`/app`).
 * Whop loads this path by default when embedding apps inside the Whop Hub/Dashboard.
 *
 * If the user already has an active ResumeAI session, seamlessly route to /dashboard.
 * If the user is unauthenticated, initiate Whop OAuth via /api/auth/login rather than
 * showing an email/password form to an embedded Whop user.
 */
export default async function AppPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);

  if (session?.value) {
    redirect("/dashboard");
  }

  redirect("/api/auth/login");
}
