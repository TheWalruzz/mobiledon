import React, { FC, useMemo } from "react";
import {
  SimpleGrid,
  Image,
  Button,
  Paper,
  Center,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { FileDetails } from "../../hooks/useFileUpload";
import { IconPencil } from "@tabler/icons";

interface FileDisplayProps {
  file: File;
  onClick: () => void;
}

const FileDisplay = ({ file, onClick }: FileDisplayProps) => {
  const isImage = useMemo(
    () =>
      ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        file.type,
      ),
    [file],
  );
  const imageUrl = useMemo(
    () => (isImage ? URL.createObjectURL(file) : ""),
    [file, isImage],
  );

  return isImage ? (
    <div style={{ position: "relative" }}>
      <Image
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
      {file.type !== "image/gif" && (
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
  ) : (
    <Paper style={{ width: "100%", height: 200 }}>
      <Center style={{ width: "100%", height: "100%" }}>
        <Text>{file.name}</Text>
      </Center>
    </Paper>
  );
};

interface MediaUploadGridProps {
  files: FileDetails[];
  onRemove: (index: number) => void;
  onClick: (index: number, fileDetails: FileDetails) => void;
}

export const MediaUploadGrid: FC<MediaUploadGridProps> = ({
  files,
  onRemove,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={4} mb={files.length > 0 ? "xs" : 0}>
      {files.map((file, index) => (
        <div key={`${index}--${file.file.name}`}>
          <FileDisplay file={file.file} onClick={() => onClick(index, file)} />
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
