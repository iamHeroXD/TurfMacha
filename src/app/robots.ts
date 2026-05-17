import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://turfmacha.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/turfs", "/turfs/"],
        disallow: [
          "/dashboard/",
          "/admin/",
          "/api/",
          "/auth/",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
