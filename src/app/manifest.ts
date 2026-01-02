import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hatzaron - הצהרת הון בקלות",
    short_name: "Hatzaron",
    description:
      "פלטפורמה חכמה לניהול הצהרות הון עבור משרדי רואי חשבון ולקוחותיהם",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/favicons/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icons/favicons/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icons/favicons/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/favicons/icon-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icons/favicons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}