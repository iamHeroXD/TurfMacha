import { MetadataRoute } from "next";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Dynamically generate sitemap including all active turf pages
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://turfmacha.vercel.app";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/turfs`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/turfs?sport=football`,  changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/turfs?sport=cricket`,   changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/turfs?sport=badminton`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/login`,  changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/signup`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic turf pages from DB
  let turfRoutes: MetadataRoute.Sitemap = [];
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (serviceKey && supabaseUrl) {
      const supabase = createAdminClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false },
      });

      const { data: turfs } = await supabase
        .from("turfs")
        .select("id, updated_at")
        .eq("is_active", true)
        .limit(500);

      turfRoutes = (turfs ?? []).map((t) => ({
        url: `${baseUrl}/turfs/${t.id}`,
        lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Sitemap generation continues without DB data
  }

  return [...staticRoutes, ...turfRoutes];
}
