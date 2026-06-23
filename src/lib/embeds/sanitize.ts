import DOMPurify from "isomorphic-dompurify";

const ALLOWED_EMBED_HOSTS = [
  "soundcloud.com",
  "w.soundcloud.com",
  "bandcamp.com",
  "youtube.com",
  "www.youtube.com",
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

export function sanitizeEmbedHtml(html: string) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["iframe", "div", "blockquote", "a"],
    ALLOWED_ATTR: [
      "src",
      "width",
      "height",
      "frameborder",
      "allow",
      "allowfullscreen",
      "loading",
      "title",
      "class",
      "style",
      "href",
    ],
  });

  const srcMatch = sanitized.match(/src=["']([^"']+)["']/i);
  if (srcMatch && !isAllowedEmbedUrl(srcMatch[1])) {
    return "";
  }

  return sanitized;
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
      return sanitizeEmbedHtml(
        `<iframe src="https://www.youtube.com/embed/${videoId}" width="100%" height="315" frameborder="0" allowfullscreen loading="lazy"></iframe>`
      );
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (!id) return "";
      return sanitizeEmbedHtml(
        `<iframe src="https://player.vimeo.com/video/${id}" width="100%" height="315" frameborder="0" allowfullscreen loading="lazy"></iframe>`
      );
    }

    if (host === "soundcloud.com" || host === "w.soundcloud.com") {
      return sanitizeEmbedHtml(
        `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`
      );
    }

    if (host.endsWith("bandcamp.com")) {
      return sanitizeEmbedHtml(
        `<iframe style="border:0;width:100%;height:120px" src="${trimmed.replace(/\/$/, "")}/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/" seamless></iframe>`
      );
    }

    if (host === "open.spotify.com") {
      const path = parsed.pathname.replace("/embed", "");
      return sanitizeEmbedHtml(
        `<iframe src="https://open.spotify.com/embed${path}" width="100%" height="152" frameborder="0" allowfullscreen loading="lazy"></iframe>`
      );
    }
  } catch {
    return "";
  }

  return "";
}
