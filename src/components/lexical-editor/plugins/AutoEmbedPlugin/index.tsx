import type { LexicalEditor } from "lexical";
import type { JSX } from "react";
import {AutoEmbedOption, LexicalAutoEmbedPlugin} from "@lexical/react/LexicalAutoEmbedPlugin";
import type {EmbedConfig, EmbedMatchResult} from "@lexical/react/LexicalAutoEmbedPlugin";
import { INSERT_FIGMA_COMMAND } from "../FigmaExtension";
import { INSERT_TWEET_COMMAND } from "../TwitterExtension";
import { INSERT_YOUTUBE_COMMAND } from "../YouTubeExtension";

interface PlaygroundEmbedConfig extends EmbedConfig {
  contentName: string;
  icon?: JSX.Element;
  exampleUrl: string;
  keywords: Array<string>;
  description?: string;
}

export const YoutubeEmbedConfig: PlaygroundEmbedConfig = {
  contentName: "Youtube Video",
  exampleUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
  },
  keywords: ["youtube", "video"],
  parseUrl: async (url: string) => {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);
    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;
    if (id != null) {
      return { id, url };
    }
    return null;
  },
  type: "youtube-video",
};

export const TwitterEmbedConfig: PlaygroundEmbedConfig = {
  contentName: "X(Tweet)",
  exampleUrl: "https://x.com/jack/status/20",
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
  },
  keywords: ["tweet", "twitter", "x"],
  parseUrl: (text: string) => {
    const match =
      /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(text);
    if (match != null) {
      return { id: match[5], url: match[1] };
    }
    return null;
  },
  type: "tweet",
};

export const FigmaEmbedConfig: PlaygroundEmbedConfig = {
  contentName: "Figma Document",
  exampleUrl: "https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File",
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_FIGMA_COMMAND, result.id);
  },
  keywords: ["figma", "figma.com", "mock-up"],
  parseUrl: (text: string) => {
    const match =
      /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(text);
    if (match != null) {
      return { id: match[3], url: match[0] };
    }
    return null;
  },
  type: "figma",
};

export const EmbedConfigs = [
  TwitterEmbedConfig,
  YoutubeEmbedConfig,
  FigmaEmbedConfig,
];

export default function AutoEmbedPlugin(): JSX.Element {
  const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
    // For now, we only support auto-embedding via pasting the link directly.
    // Opening a modal is not implemented to keep dependencies light.
    console.warn("Embed modal not implemented.");
  };

  const getMenuOptions = (
    activeEmbedConfig: PlaygroundEmbedConfig,
    embedFn: () => void,
    dismissFn: () => void,
  ) => {
    return [
      new AutoEmbedOption("Dismiss", {
        onSelect: dismissFn,
      }),
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn,
      }),
    ];
  };

  return (
    <LexicalAutoEmbedPlugin<PlaygroundEmbedConfig>
      embedConfigs={EmbedConfigs}
      onOpenEmbedModalForConfig={openEmbedModal}
      getMenuOptions={getMenuOptions}
    />
  );
}
