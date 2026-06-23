const ALLOWED_EMBED_HOSTS = [
  "soundcloud.com",
  "w.soundcloud.com",
  "bandcamp.com",
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "player.vimeo.com",
  "open.spotify.com",
];

function isAllowedEmbedUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return ALLOWED_EMBED_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

function extractIframeSrc(html: string) {
  const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function buildIframe(src: string, height = "315") {
  return `<iframe src="${src}" width="100%" height="${height}" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen loading="lazy" title="Embed"></iframe>`;
}

export function sanitizeEmbedHtml(html: string) {
  const src = extractIframeSrc(html);
  if (!src || !isAllowedEmbedUrl(src)) {
    return "";
  }

  const heightMatch = html.match(/height=["'](\d+)["']/i);
  return buildIframe(src, heightMatch?.[1] ?? "315");
}

export function urlToEmbedHtml(url: string) {
  const trimmed = url.trim();

  if (trimmed.includes("<iframe") || trimmed.includes("<blockquote")) {
    return sanitizeEmbedHtml(trimmed);
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "youtu.be") {
      const videoId =
        host === "youtu.be"
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get("v");
      if (!videoId) return "";
      return buildIframe(`https://www.youtube.com/embed/${videoId}`);
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (!id) return "";
      return buildIframe(`https://player.vimeo.com/video/${id}`);
    }

    if (host === "soundcloud.com" || host === "w.soundcloud.com") {
      return buildIframe(
        `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`,
        "166"
      );
    }

    if (host.endsWith("bandcamp.com")) {
      return buildIframe(
        `${trimmed.replace(/\/$/, "")}/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/`,
        "120"
      );
    }

    if (host === "open.spotify.com") {
      const path = parsed.pathname.replace("/embed", "");
      return buildIframe(`https://open.spotify.com/embed${path}`, "152");
    }
  } catch {
    return "";
  }

  return "";
}
