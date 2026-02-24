"use client";

import { useLocalStorage } from "./use-local-storage";
import { tools } from "@/tools/registry";

const MRU_KEY = "run-tools:mru";
const knownSlugs = new Set(tools.map((t) => t.slug));

export function useMruTools() {
  const [slugs, setSlugs] = useLocalStorage<string[]>(MRU_KEY, []);

  function recordVisit(slug: string) {
    setSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered];
    });
  }

  // Filter out any stale slugs (e.g. a removed tool) at read time
  const validSlugs = slugs.filter((s) => knownSlugs.has(s));

  return { slugs: validSlugs, recordVisit };
}
