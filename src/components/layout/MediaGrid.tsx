import React, { FC, useCallback, useMemo, useState } from "react";
import { Button, Grid, Text } from "@mantine/core";
import { Attachment } from "masto";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { MediaDisplay } from "./MediaDisplay";

interface MediaGridProps {
  items: Attachment[];
  sensitive: boolean;
}

export const MediaGrid: FC<MediaGridProps> = ({ items, sensitive }) => {
  const [showSensitiveFilter, setShowSensitiveFilter] = useState(sensitive);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const slides = useMemo(
    () =>
      items.map((item) => {
        const typeSpecific = ["video", "gifv"].includes(item.type)
          ? {
              sources: [{ src: item.url, type: "video/mp4" }],
              controls: true,
            }
          : { src: item.url };
        return {
          // TODO: make it work with audio?
          type: ["video", "gifv"].includes(item.type) ? "video" : "image",
          alt: item.description,
          description: item.description,
          width: item.meta?.original?.width,
          height: item.meta?.original?.height,
          url: item.url,
          ...typeSpecific,
        };
      }),
    [items],
  );

  const renderNavigation = useMemo(
    () => (slides.length <= 1 ? () => null : undefined),
    [slides.length],
  );

  const onSensitiveToggle = useCallback(() => {
    setShowSensitiveFilter((old) => !old);
  }, []);

  const onItemClick = useCallback(
    (item: Attachment) => {
      const index = slides.findIndex((image) => image.url === item.url);
      setCurrentImageIndex(index);
      setLightboxOpen(true);
    },
    [slides],
  );

  const onMoreClick = useCallback(() => {
    setCurrentImageIndex(3);
    setLightboxOpen(true);
  }, []);

  const onCloseViewer = useCallback(() => {
    setCurrentImageIndex(0);
    setLightboxOpen(false);
  }, []);

  return (
    <>
      {sensitive && (
        <Button w="100%" mb="xs" onClick={onSensitiveToggle}>
          {showSensitiveFilter ? "Reveal" : "Hide"}
        </Button>
      )}
      <Grid gutter="xs">
        <Grid.Col span={items.length === 1 ? 12 : 6}>
          <MediaDisplay
            attachment={items[0]}
            showBlur={showSensitiveFilter}
            onClick={onItemClick}
            fullWidth={items.length === 1}
          />
        </Grid.Col>
        {items.length >= 2 && (
          <Grid.Col span={6}>
            <MediaDisplay
              attachment={items[1]}
              showBlur={showSensitiveFilter}
              onClick={onItemClick}
            />
          </Grid.Col>
        )}

        {items.length >= 3 && (
          <Grid.Col span={6}>
            <MediaDisplay
              attachment={items[2]}
              showBlur={showSensitiveFilter}
              onClick={onItemClick}
            />
          </Grid.Col>
        )}

        {items.length >= 4 && (
          <Grid.Col span={6}>
            <div style={{ position: "relative" }}>
              <MediaDisplay
                attachment={items[3]}
                showBlur={showSensitiveFilter}
                onClick={onItemClick}
              />
              {items.length > 4 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    opacity: 0.8,
                    borderRadius: 8,
                  }}
                  onClick={onMoreClick}
                >
                  <Text color="white" fz="lg">
                    +{items.length - 3}
                  </Text>
                </div>
              )}
            </div>
          </Grid.Col>
        )}
      </Grid>
      {lightboxOpen && (
        <Lightbox
          open
          close={onCloseViewer}
          plugins={[Video, Zoom, Captions, Thumbnails]}
          index={currentImageIndex}
          slides={slides as any}
          controller={{ closeOnBackdropClick: true }}
          render={{
            buttonPrev: renderNavigation,
            buttonNext: renderNavigation,
          }}
        />
      )}
    </>
  );
};
