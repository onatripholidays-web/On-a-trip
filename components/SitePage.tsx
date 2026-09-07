import type { ReactNode } from "react";

export default function SitePage({ children }: { children: ReactNode }) {
  return <div className="oat-site">{children}</div>;
}
