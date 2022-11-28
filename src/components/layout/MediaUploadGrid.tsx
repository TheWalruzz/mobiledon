import React, { FC } from "react";
import { SimpleGrid, Image, Button, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconPencil } from "@tabler/icons";
import { Attachment } from "masto";

interface FileDisplayProps {
  file: Attachment;
  onClick: () => void;
  canEdit: boolean;
}

const FileDisplay = ({ file, onClick, canEdit }: FileDisplayProps) => {
  return (
    <div style={{ position: "relative" }}>
      <Image src={file.previewUrl} />
      {file.type === "image" && canEdit && (
        <ActionIcon
          onClick={onClick}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          variant="filled"
        >
          <IconPencil />
        </ActionIcon>
      )}
    </div>
  );
};

interface MediaUploadGridProps {
  files: Attachment[];
  onRemove: (index: number) => void;
  onClick: (index: number, file: Attachment) => void;
  canEdit: boolean;
}

export const MediaUploadGrid: FC<MediaUploadGridProps> = ({
  files,
  onRemove,
  onClick,
  canEdit,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={4} mb={files.length > 0 ? "xs" : 0}>
      {files.map((file, index) => (
        <div key={`${index}--${file.id}`}>
          <FileDisplay
            file={file}
            canEdit={canEdit}
            onClick={() => onClick(index, file)}
          />
          <Button
            compact
            color="default"
            mt="xs"
            fullWidth
            onClick={() => onRemove(index)}
          >
            {t("editToot.removeFile", "Remove")}
          </Button>
        </div>
      ))}
    </SimpleGrid>
  );
};
