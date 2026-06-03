import SurahContent from "./SurahContent";

// Pure Server Component Wrapper - No client code here to avoid TypeScript null errors!
export default function QuranDynamicPage() {
  return <SurahContent />;
}

// Next.js static export schema mapping for all 114 Surahs
export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}