import { ReactRenderer } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import tippy, { Instance } from "tippy.js";
import { PluginKey } from "prosemirror-state";
import { getApiClient } from "../../utils/getApiClient";

import { MentionList } from "./MentionList";
import { Results } from "masto";

export const suggestion = <
  T extends keyof Results,
  U extends Results[T][number],
>(
  suggestionChar: string,
  searchType: T,
  resultsMapper: (item: U, index: number, array: U[]) => string,
) => ({
  char: suggestionChar,
  pluginKey: new PluginKey(`suggestion-${searchType}`),

  items: async ({ query }: { query: string }) => {
    if (query) {
      const apiClient = await getApiClient();
      const results = await apiClient.search({ q: query, limit: 5 });
      return (await results.next()).value[searchType].map(resultsMapper as any);
    }

    return [];
  },

  render: () => {
    let component: ReactRenderer<any>;
    let popup: Instance[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        // TODO: replace with something from Mantine if possible
        popup = tippy("body" as any, {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === "Escape") {
          popup?.[0]?.hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup?.[0]?.destroy();
        component?.destroy();
      },
    };
  },
});
