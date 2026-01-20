import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Slice } from '@tiptap/pm/model';

export interface SlashCommandOptions {
  suggestion: {
    char: string;
    allowSpaces: boolean;
    allowedPrefixes: string[] | null;
    startOfLine: boolean;
    decorationTag: string;
    decorationClass: string;
  };
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allowSpaces: false,
        allowedPrefixes: [' '],
        startOfLine: false,
        decorationTag: 'span',
        decorationClass: 'slash-command-decoration',
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('slashCommand'),
        props: {
          handleKeyDown: (view, event) => {
            // Handle slash command trigger
            if (event.key === '/') {
              const { state } = view;
              const { selection } = state;
              const { $from } = selection;
              
              // Check if we're at the start of a paragraph or after a space
              const textBefore = $from.nodeBefore?.textContent || '';
              const isAtStart = $from.parentOffset === 0;
              const isAfterSpace = textBefore.endsWith(' ') || isAtStart;
              
              if (isAfterSpace || isAtStart) {
                // Dispatch custom event for slash menu
                const event = new CustomEvent('slashCommand', {
                  detail: { position: $from.pos },
                });
                view.dom.dispatchEvent(event);
                return true;
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});
