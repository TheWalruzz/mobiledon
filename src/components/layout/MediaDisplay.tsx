import React, { FC, useCallback, useEffect, useMemo } from "react";
import { FocusedImage } from "image-focus";
import { Attachment } from "masto";
import { blurHashToDataURL } from "../../utils/blurhashToDataUrl";
import { downloadFile } from "../../utils/downloadFile";
import { useLazyMedia } from "../../hooks/useLazyMedia";

interface DisplayProps {
  attachment: Attachment;
  showBlur: boolean;
  onClick?: () => void;
}

const VideoDisplay: FC<DisplayProps> = ({ attachment, showBlur }) => {
  const blurredImage = useMemo(
    () =>
      blurHashToDataURL(
        attachment.blurhash!,
        attachment.meta?.small?.width,
        attachment.meta?.small?.height,
      ),
    [
      attachment.blurhash,
      attachment.meta?.small?.height,
      attachment.meta?.small?.width,
    ],
  );

  return (
    <video
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      loop={attachment.type === "gifv"}
      autoPlay={attachment.type === "gifv"}
      src={attachment.url! || attachment.remoteUrl!}
      controls={attachment.type === "video"}
      poster={showBlur ? blurredImage : undefined}
      preload="metadata"
    />
  );
};

const ImageDisplay: FC<DisplayProps> = ({ attachment, showBlur, onClick }) => {
  const blurredImage = useMemo(
    () => blurHashToDataURL(attachment.blurhash!),
    [attachment.blurhash],
  );
  const {
    ref,
    src: mediaSrc,
    loaded,
  } = useLazyMedia<HTMLImageElement>(
    attachment.previewUrl || attachment.url!,
    blurredImage,
  );

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

  return (
    <img
      ref={ref}
      src={showBlur || attachment.type === "unknown" ? blurredImage : mediaSrc}
      alt={attachment.description ?? ""}
      onClick={onClick}
    />
  );
};

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
  const handleClick = useCallback(() => {
    if (attachment.type === "unknown") {
      downloadFile(attachment.remoteUrl || attachment.url!);
    } else if (!showBlur) {
      onClick(attachment);
    }
  }, [attachment, onClick, showBlur]);

  const mediaElement = useMemo(() => {
    switch (attachment.type as any) {
      // TODO: add gif/video preview
      case "gifv":
      case "video":
        return (
          <VideoDisplay
            attachment={attachment}
            showBlur={showBlur}
            onClick={handleClick}
          />
        );
      case "audio":
        return (
          <audio style={{ width: "100%" }} src={attachment.url!} controls />
        );
      case "image":
      default:
        return (
          <ImageDisplay
            attachment={attachment}
            showBlur={showBlur}
            onClick={handleClick}
          />
        );
    }
  }, [attachment, handleClick, showBlur]);

  return (
    <div
      style={{
        height: "100%",
        paddingTop: ["audio"].includes(attachment.type)
          ? 0
          : fullWidth && (attachment.meta?.original?.aspect ?? 1) > 1
          ? `calc(100% / ${attachment.meta?.original?.aspect})`
          : "100%",
        borderRadius: 8,
        position: "relative",
      }}
    >
      {mediaElement}
    </div>
  );
};
