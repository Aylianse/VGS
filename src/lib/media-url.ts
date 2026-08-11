import { SITE } from "@/lib/site";

export function absoluteMediaUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE.url}${url.startsWith("/") ? url : `/${url}`}`;
}
