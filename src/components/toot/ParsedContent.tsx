import React, { FC, MouseEvent, useCallback, useMemo } from "react";
import parse, { DOMNode, domToReact, Element } from "html-react-parser";
import { Link } from "react-router-dom";
import { prepareTextForRender } from "../../utils/prepareTextContent";

interface ParsedContentProps {
  html: string;
  context: Entity.Status;
  onClick?: (event: React.MouseEvent) => void;
}

export const ParsedContent: FC<ParsedContentProps> = ({
  html,
  context,
  onClick,
}) => {
  const stopPropagationFix = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  const content = useMemo(
    () =>
      parse(prepareTextForRender(html, context.emojis), {
        replace: (node: DOMNode) => {
          if (node.type === "tag") {
            const element = node as Element;
            if (
              element.name === "a" &&
              element.attribs.class?.includes("hashtag")
            ) {
              const urlParts = element.attribs.href.split("/");
              const hashValue = urlParts[urlParts.length - 1];
              return (
                <Link to={`/tag/${hashValue}`} onClick={stopPropagationFix}>
                  {domToReact(element.children)}
                </Link>
              );
            }

            if (
              element.name === "a" &&
              element.attribs.class?.includes("mention") &&
              element.attribs.class?.includes("u-url")
            ) {
              const url = new URL(element.attribs.href);
              return (
                <Link
                  to={`/user/${url.pathname.replace(/^\/@/, "")}@${url.host}`}
                  onClick={stopPropagationFix}
                >
                  {domToReact(element.children)}
                </Link>
              );
            }
          }
        },
      }),
    [context.emojis, html, stopPropagationFix],
  );

  return <div onClick={onClick}>{content}</div>;
};
