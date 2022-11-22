import { sanitize } from "dompurify";
import React, { FC } from "react";

interface InnerHTMLProps {
  component?: React.ElementType;
  children: string;
  onClick?: (event: React.MouseEvent) => void;
}

export const InnerHTML: FC<InnerHTMLProps> = ({
  component: Component = "span",
  onClick,
  children,
}) => {
  return (
    <Component
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: sanitize(children) }}
    />
  );
};
