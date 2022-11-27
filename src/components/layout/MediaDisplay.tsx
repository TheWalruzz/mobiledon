import React, { FC, useCallback, useEffect, useMemo } from "react";
import { FocusedImage } from "image-focus";
import { Attachment } from "masto";
import { blurHashToDataURL } from "../../utils/blurhashToDataUrl";
import { downloadFile } from "../../utils/downloadFile";
import { useLazyMedia } from "../../hooks/useLazyMedia";

interface MediaDisplayProps {
  attachment: Attachment;
  showBlur: boolean;
  onClick: (attachment: Attachment) => void;
  fullWidth?: boolean;
}

export const MediaDisplay: FC<MediaDisplayProps> = ({
  attachment,
  showBlur,
  fullWidth,
  onClick,
}) => {
  const blurredImage = useMemo(
    () => blurHashToDataURL(attachment.blurhash!),
    [attachment.blurhash],
  );
  const {
    ref,
    src: mediaSrc,
    loaded,
  } = useLazyMedia<HTMLImageElement | HTMLVideoElement>(
    attachment.remoteUrl || attachment.previewUrl || attachment.url!,
    blurredImage,
  );

  const handleClick = useCallback(() => {
    if (attachment.type === "unknown") {
      downloadFile(attachment.remoteUrl || attachment.url!);
    } else if (!showBlur) {
      onClick(attachment);
    }
  }, [attachment, onClick, showBlur]);

  useEffect(() => {
    let focusedImage: FocusedImage;
    if (ref.current !== null && ref.current?.parentElement) {
      focusedImage = new FocusedImage(ref.current as any, {
        focus: {
          x: (attachment?.meta as any)?.focus?.x ?? 0,
          y: (attachment?.meta as any)?.focus?.y ?? 0,
        },
      });
    }

    return () => focusedImage?.stopListening();
  }, [attachment?.meta, loaded, ref, showBlur]);

  const mediaElement = useMemo(() => {
    switch (attachment.type as any) {
      // TODO: add gif/video preview
      // TODO: fix blur size for videos
      // TODO: figure something better to not use useLazyMedia for video tag
      case "gifv":
      case "video":
        return (
          <video
            ref={attachment.type === "gifv" ? (ref as any) : null}
            style={{
              width: "100%",
              aspectRatio: attachment.meta?.small?.aspect,
            }}
            loop={attachment.type === "gifv"}
            autoPlay={attachment.type === "gifv"}
            src={attachment.remoteUrl!}
            controls={attachment.type === "video"}
            poster={showBlur ? blurredImage : undefined}
            preload="metadata"
          />
        );
      case "audio":
        return (
          <audio style={{ width: "100%" }} src={attachment.url!} controls />
        );
      case "image":
      default:
        return (
          <img
            ref={ref as any}
            src={
              showBlur || attachment.type === "unknown"
                ? blurredImage
                : mediaSrc
            }
            alt={attachment.description ?? ""}
            onClick={handleClick}
          />
        );
    }
  }, [
    attachment.description,
    attachment.meta?.small?.aspect,
    attachment.remoteUrl,
    attachment.type,
    attachment.url,
    blurredImage,
    handleClick,
    mediaSrc,
    ref,
    showBlur,
  ]);

  return (
    <div
      style={{
        height: "100%",
        paddingTop: ["video", "audio"].includes(attachment.type)
          ? 0
          : fullWidth && (attachment.meta?.original?.aspect ?? 1) > 1
          ? `calc(100% / ${attachment.meta?.original?.aspect})`
          : "100%",
        borderRadius: 8,
      }}
    >
      {mediaElement}
    </div>
  );
};
