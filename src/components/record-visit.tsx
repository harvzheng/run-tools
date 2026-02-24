"use client";

import { useEffect } from "react";
import { useMruTools } from "@/hooks/use-mru-tools";

export function RecordVisit({ slug }: { slug: string }) {
  const { recordVisit } = useMruTools();

  useEffect(() => {
    recordVisit(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}
