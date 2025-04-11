"use client";

import { ReactNode } from "react";

type LinkToBackProps = {
  children: ReactNode;
  label: ReactNode;
};

export function WithLabel({ children, label }: LinkToBackProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs">{label}</label>
      {children}
    </div>
  );
}
