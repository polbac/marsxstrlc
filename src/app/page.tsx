import { SiteHeader, SiteHeaderSpacer } from "@/components/site-header";
import { TimelineFeed } from "@/components/timeline/timeline-feed";
import { getPublishedPosts } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <SiteHeader />
      <main className="relative z-0 mx-auto w-full max-w-6xl px-4 pb-10 md:pb-16">
        <SiteHeaderSpacer />
        <TimelineFeed posts={posts} />
      </main>
    </>
  );
}

export const metadata = {
  title: "CRONICAS MARS x STRLC RECORDS",
  description: "Bitácora del proceso creativo de la obra sonora de Mars.",
};
