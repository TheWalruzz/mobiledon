import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { FocusedImage } from "image-focus";
import { blurHashToDataURL } from "../utils/blurhashToDataUrl";

interface MediaDisplayProps {
  attachment: Entity.Attachment;
  showBlur: boolean;
  onClick: (attachment: Entity.Attachment) => void;
  fullHeight?: boolean;
}

export const MediaDisplay: FC<MediaDisplayProps> = ({
  attachment,
  showBlur,
  fullHeight,
  onClick,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const blurredImage = useMemo(
    () => blurHashToDataURL(attachment.blurhash!),
    [attachment.blurhash],
  );

  const handleClick = useCallback(() => {
    onClick(attachment);
  }, [attachment, onClick]);

  useEffect(() => {
    let focusedImage: FocusedImage;
    if (imageRef.current !== null) {
      focusedImage = new FocusedImage(imageRef.current, {
        focus: (attachment.meta as any)?.focus,
      });
    }

    return () => focusedImage?.stopListening();
  }, [attachment.meta, showBlur]);

  const mediaElement = useMemo(() => {
    switch (attachment.type as any) {
      // TODO: add gif/video preview and fix their layouts
      case "gifv":
      case "video":
        if (showBlur) {
          return (
            <img
              ref={imageRef}
              src={blurredImage}
              alt={attachment.description ?? ""}
              loading="lazy"
            />
          );
        }

        if (attachment.type === "gifv") {
          return (
            <video
              ref={imageRef as any}
              loop
              autoPlay
              src={attachment.url}
              preload="metadata"
            />
          );
        } else {
          return (
            <video
              width="100%"
              loop
              src={attachment.url}
              controls
              preload="metadata"
            />
          );
        }
      case "audio":
        return (
          <audio style={{ width: "100%" }} src={attachment.url} controls />
        );
      case "image":
      default:
        return (
          <img
            ref={imageRef}
            src={
              showBlur || attachment.type === "unknown"
                ? blurredImage
                : attachment.preview_url
            }
            alt={attachment.description ?? ""}
            onClick={handleClick}
          />
        );
    }
  }, [
    attachment.description,
    attachment.preview_url,
    attachment.type,
    attachment.url,
    blurredImage,
    handleClick,
    showBlur,
  ]);

  return (
    <div
      style={{
        height: fullHeight ? "100%" : undefined,
        paddingTop: ["video", "audio"].includes(attachment.type)
          ? 0
          : fullHeight
          ? "100%"
          : "56.25%",
        borderRadius: 8,
      }}
    >
      {mediaElement}
    </div>
  );
};
