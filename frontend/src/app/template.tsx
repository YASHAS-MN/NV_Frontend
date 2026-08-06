import { PageReveal } from "@/components/nebula/page-reveal";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageReveal>{children}</PageReveal>;
}
