"use client";

import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

import { sanitizeEmbedHtml } from "@/lib/embeds/sanitize";

function EmbedNodeView({ node }: { node: { attrs: { html?: string } } }) {
  const safe = sanitizeEmbedHtml(node.attrs.html ?? "");
  return (
    <NodeViewWrapper className="embed-block my-4 rounded-lg border border-dashed border-border p-3">
      {safe ? (
        <div dangerouslySetInnerHTML={{ __html: safe }} />
      ) : (
        <p className="text-sm text-muted-foreground">Embed vacío</p>
      )}
    </NodeViewWrapper>
  );
}

function VideoNodeView({ node }: { node: { attrs: { src?: string } } }) {
  return (
    <NodeViewWrapper className="video-block my-4">
      <video
        src={node.attrs.src}
        controls
        playsInline
        className="w-full rounded-lg border border-border"
      />
    </NodeViewWrapper>
  );
}

export const embedNodeView = ReactNodeViewRenderer(EmbedNodeView);
export const videoNodeView = ReactNodeViewRenderer(VideoNodeView);
