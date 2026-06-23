import { getHeaderImageSrc } from "@/lib/header-image";

const HEADER_WIDTH = 2400;
const HEADER_HEIGHT = 304;

export function SiteHeader() {
  const src = getHeaderImageSrc();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Crónicas Mars · STRLX Records"
        width={HEADER_WIDTH}
        height={HEADER_HEIGHT}
        className="block h-auto w-full"
        fetchPriority="high"
        decoding="async"
      />
    </header>
  );
}

export function SiteHeaderSpacer() {
  return (
    <div
      className="w-full shrink-0"
      style={{ aspectRatio: `${HEADER_WIDTH} / ${HEADER_HEIGHT}` }}
      aria-hidden
    />
  );
}
