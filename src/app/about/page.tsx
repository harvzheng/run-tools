import type { Metadata } from "next";
import { Heart, Zap, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About — RunTools",
  description: "What RunTools is and why it exists.",
};

const values = [
  {
    icon: Zap,
    title: "Instant answers",
    description:
      "Every tool gives you results the moment you land on the page. No sign-up forms, no loading spinners, no \"Calculate\" buttons.",
  },
  {
    icon: Lock,
    title: "Private by design",
    description:
      "Everything runs in your browser. We don't collect data, track usage, or require an account. Your inputs stay on your device.",
  },
  {
    icon: Heart,
    title: "Built for runners",
    description:
      "Made by runners who got tired of ad-heavy calculators and bloated training apps when all they needed was a quick answer.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        About RunTools
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
        RunTools is a free collection of utilities for runners and coaches.
        Calculate heart rate zones, convert paces, and get quick answers without
        the overhead of a full training platform.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-500">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Open source
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          RunTools is open source and built with Next.js, Tailwind CSS, and
          Framer Motion. Contributions, feature requests, and bug reports are
          welcome on{" "}
          <a
            href="https://github.com/harvzheng/run-tools"
            className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-400 dark:text-brand-400 dark:decoration-brand-800 dark:hover:decoration-brand-600"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </main>
  );
}
