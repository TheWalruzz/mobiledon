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
    if (imageRef.current !== null) {
      new FocusedImage(imageRef.current, {
        focus: (attachment.meta as any)?.focus,
      });
    }
  }, [attachment.meta, showBlur]);

  return (
    <div
      style={{
        height: fullHeight ? "100%" : undefined,
        paddingTop: ["video"].includes(attachment.type)
          ? 0
          : fullHeight
          ? "100%"
          : "56.25%",
        borderRadius: 8,
      }}
    >
      {/* TODO: add gif/video preview and fix their layouts */}
      {["gifv", "video"].includes(attachment.type) ? (
        showBlur ? (
          <img
            ref={imageRef}
            src={blurredImage}
            alt={attachment.description ?? ""}
          />
        ) : attachment.type === "gifv" ? (
          <video
            ref={imageRef as any}
            loop
            autoPlay
            src={attachment.url}
            preload="metadata"
          />
        ) : (
          <video
            width="100%"
            loop
            src={attachment.url}
            controls
            preload="metadata"
          />
        )
      ) : (
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
      )}
    </div>
  );
};
