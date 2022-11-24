import React, { FC, useCallback, useMemo, useState } from "react";
import { Button, Grid, Space, Text } from "@mantine/core";
import { MediaDisplay } from "./MediaDisplay";
import ImageViewer from "react-simple-image-viewer";
import { Attachment } from "masto";

interface MediaGridProps {
  items: Attachment[];
  sensitive: boolean;
}

export const MediaGrid: FC<MediaGridProps> = ({ items, sensitive }) => {
  const [showSensitiveFilter, setShowSensitiveFilter] = useState(sensitive);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const viewerImages = useMemo(() => items.map((item) => item.url!), [items]);

  const onSensitiveToggle = useCallback(() => {
    setShowSensitiveFilter((old) => !old);
  }, []);

  const onItemClick = useCallback(
    (item: Attachment) => {
      const index = viewerImages.findIndex((image) => image === item.url);
      setCurrentImage(index);
      setIsViewerOpen(true);
    },
    [viewerImages],
  );

  const onMoreClick = useCallback(() => {
    setCurrentImage(2);
    setIsViewerOpen(true);
  }, []);

  const onCloseViewer = useCallback(() => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  }, []);

  // TODO: add lightbox

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
            fullHeight
          />
        </Grid.Col>
        {items.length > 1 && (
          <Grid.Col span={6}>
            <MediaDisplay
              attachment={items[1]}
              showBlur={showSensitiveFilter}
              onClick={onItemClick}
              fullHeight={items.length === 2}
            />
            {items.length > 2 && <Space h="xs" />}
            {items.length >= 3 && (
              <div style={{ position: "relative" }}>
                <MediaDisplay
                  attachment={items[2]}
                  showBlur={showSensitiveFilter}
                  onClick={onItemClick}
                />
                {items.length > 3 && (
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
                      +{items.length - 2}
                    </Text>
                  </div>
                )}
              </div>
            )}
          </Grid.Col>
        )}
      </Grid>
      {isViewerOpen && (
        <ImageViewer
          src={viewerImages}
          currentIndex={currentImage}
          disableScroll
          closeOnClickOutside
          onClose={onCloseViewer}
          backgroundStyle={{
            zIndex: 201,
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
        />
      )}
    </>
  );
};
