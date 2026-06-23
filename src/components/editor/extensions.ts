import { Node, mergeAttributes } from "@tiptap/core";

import { embedNodeView, videoNodeView } from "@/components/editor/node-views";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embedBlock: {
      setEmbed: (html: string) => ReturnType;
    };
    videoBlock: {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

export const EmbedBlock = Node.create({
  name: "embedBlock",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      html: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="embed-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "embed-block",
        class: "embed-block my-6",
      }),
      ["div", { class: "embed-block-inner", innerHTML: HTMLAttributes.html }],
    ];
  },

  addNodeView() {
    return embedNodeView;
  },

  addCommands() {
    return {
      setEmbed:
        (html: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { html },
          }),
    };
  },
});

export const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "video-block",
        class: "video-block my-6",
      }),
      [
        "video",
        {
          src: HTMLAttributes.src,
          controls: true,
          playsInline: true,
          class: "w-full rounded-lg border border-border",
        },
      ],
    ];
  },

  addNodeView() {
    return videoNodeView;
  },

  addCommands() {
    return {
      setVideo:
        ({ src }) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src },
          }),
    };
  },
});
