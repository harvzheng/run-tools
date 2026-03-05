import type { Metadata } from "next";
import { getToolBySlug, tools, toolComponents } from "@/tools/registry";
import { notFound } from "next/navigation";
import { ToolShell } from "@/components/tool-shell";
import { RecordVisit } from "@/components/record-visit";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: "Tool Not Found — RunTools" };
  }

  const url = `https://runtools.app/tools/${tool.slug}`;
  return {
    title: `${tool.name} — RunTools`,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: tool.name,
      description: tool.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tool.name,
      description: tool.description,
    },
  };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `https://runtools.app/tools/${tool.slug}`,
    applicationCategory: "SportsApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecordVisit slug={tool.slug} />
      <ToolShell tool={tool}>
        <Component />
      </ToolShell>
    </>
  );
}
