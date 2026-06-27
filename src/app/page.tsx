import { redirect } from "next/navigation";

// The marketing landing page has been removed — TurfMacha is now an app-first
// experience. The root route never renders: middleware redirects authenticated
// users to their dashboard and everyone else to /login. This server redirect is
// a belt-and-suspenders fallback in case a request reaches the route directly.
export default function RootPage() {
  redirect("/login");
}
