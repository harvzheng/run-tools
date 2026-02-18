import dynamic from "next/dynamic";
import { getToolBySlug, tools } from "@/tools/registry";
import { notFound } from "next/navigation";
import { ToolShell } from "@/components/tool-shell";

const toolComponents: Record<string, ReturnType<typeof dynamic>> = {
  "hr-zones": dynamic(() => import("@/tools/hr-zones/component")),
  "pace-converter": dynamic(() => import("@/tools/pace-converter/component")),
};

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const Component = toolComponents[tool.slug];
  if (!Component) notFound();

  return (
    <ToolShell tool={tool}>
      <Component />
    </ToolShell>
  );
}
