import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type SessionUser } from "@/lib/auth";

/**
 * Protected routes that require authentication.
 * These are also configured in src/proxy.ts for optimistic redirects.
 */
export const protectedRoutes = ["/chat", "/dashboard", "/profile"];

/**
 * Cached session fetcher - deduplicates session lookups within a single request.
 * React's cache() ensures this only hits the database once per request,
 * even if called multiple times from different components/actions.
 */
export const getSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

/**
 * Checks if the current request is authenticated.
 * Should be called in Server Components for protected routes.
 *
 * @returns The session object if authenticated
 * @throws Redirects to home page if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return session;
}

/**
 * Gets the current session without requiring authentication.
 * Returns null if not authenticated.
 *
 * @returns The session object or null
 */
export async function getOptionalSession() {
  return await getSession();
}

/**
 * Checks if a given path is a protected route.
 *
 * @param path - The path to check
 * @returns True if the path requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

/**
 * Gets the firmId from the current session.
 * Returns null if not authenticated or no firm associated.
 */
export async function getFirmId(): Promise<string | null> {
  const session = await getSession();
  if (!session?.user) return null;
  return (session.user as SessionUser).firmId || null;
}

/**
 * Requires a firmId from the current session.
 * Throws an error if not authenticated or no firm associated.
 */
export async function requireFirmId(): Promise<string> {
  const session = await requireAuth();
  const firmId = (session.user as SessionUser).firmId;
  if (!firmId) {
    throw new Error("No firm associated with user");
  }
  return firmId;
}
