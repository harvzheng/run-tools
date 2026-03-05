"use client";

import { useState } from "react";
import { inputClass } from "@/lib/styles";

interface TimeInputProps {
  value: string;
  onCommit: (time: string) => void;
  id?: string;
  variant?: "bordered" | "inline";
}

export function TimeInput({
  value,
  onCommit,
  id,
  variant = "bordered",
}: TimeInputProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  const className =
    variant === "inline"
      ? "mt-1 h-auto w-full rounded-lg bg-transparent p-0 text-lg font-bold tabular-nums text-neutral-900 outline-none focus:ring-0 dark:text-neutral-100"
      : inputClass;

  return (
    <input
      id={id}
      type="text"
      inputMode="text"
      value={editing ? text : value}
      onFocus={() => {
        setEditing(true);
        setText(value);
      }}
      onBlur={(e) => {
        onCommit(e.target.value);
        setEditing(false);
      }}
      onChange={(e) => {
        setText(e.target.value);
        onCommit(e.target.value);
      }}
      className={className}
    />
  );
}
