import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Group,
  Text,
  Image,
  Textarea,
  Modal,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useInputState } from "@mantine/hooks";
import { FocusPicker } from "image-focus";
import { Attachment } from "masto";
import { CustomModalProps } from "../../contexts/CustomModalContext";

export interface ImageDetailsModalProps extends Record<string, unknown> {
  fileDetails: Attachment | null;
  onSubmit: (file: Attachment) => void;
}

export const ImageDetailsModal: FC<
  CustomModalProps<ImageDetailsModalProps>
> = ({ innerProps: { fileDetails, onSubmit }, opened, onClose }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { t } = useTranslation();
  const [description, setDescription] = useInputState(
    fileDetails?.description || "",
  );
  const [focus, setFocus] = useState(
    fileDetails?.meta?.focus || { x: 0, y: 0 },
  );
  const [ready, setReady] = useState(false);

  // TODO: for some reason you cannot update your sent media... fix that
  const handleSubmit = useCallback(async () => {
    if (fileDetails) {
      onSubmit({
        ...fileDetails,
        meta: {
          ...fileDetails.meta,
          focus,
        },
        description,
      });
      onClose();
    }
  }, [description, fileDetails, focus, onClose, onSubmit]);

  useEffect(() => {
    let picker: FocusPicker;
    if (imageRef.current && ready) {
      picker = new FocusPicker(imageRef.current, {
        onChange: (focus) => setFocus(focus),
        focus: focus,
      });
    }

    return () => {
      picker?.disable();
      picker?.stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (!opened) {
      setReady(false);
    }
  }, [opened]);

  return (
    <Modal
      closeOnEscape={false}
      withCloseButton={false}
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700}>{t("imageDetails.title", "Edit image details")}</Text>
      }
    >
      <Text fz="sm" mb="xs">
        {t(
          "imageDetails.focalPointDescription",
          "Pick the focal point of the image. This part will always be in view, even when the image is resized.",
        )}
      </Text>
      <Image
        imageRef={imageRef}
        src={fileDetails?.url}
        mb="xs"
        imageProps={{ onLoad: () => setReady(true) }}
      />
      <Textarea
        mb="xs"
        value={description}
        onChange={setDescription}
        label={t("imageDetails.description", "Image description")}
        placeholder={t(
          "imageDetails.descriptionPlaceholder",
          "Provide a text description of the image for the visually impaired.",
        )}
      />
      <Flex justify="end">
        <Group>
          <Button variant="default" onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("common.save", "Save")}</Button>
        </Group>
      </Flex>
    </Modal>
  );
};
