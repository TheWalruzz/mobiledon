import { useListState } from "@mantine/hooks";
import { ChangeEvent, useCallback, useMemo, useRef } from "react";

export interface FileDetails {
  file: File;
  description?: string;
  focus?: { x: number; y: number };
}

export const useFileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, handlers] = useListState<FileDetails>([]);

  const onFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget?.files) {
        const filesArr = Array.from(e.currentTarget.files).map((file) => ({
          file,
          description: "",
        }));
        handlers.append(...filesArr);
        if (fileInputRef.current) {
          (fileInputRef.current.value as any) = null;
        }
      }
    },
    [handlers],
  );

  const removeFile = useCallback(
    (index: number) => {
      handlers.remove(index);
    },
    [handlers],
  );

  const updateFile = useCallback(
    (index: number, file: FileDetails) => {
      handlers.setItem(index, file);
    },
    [handlers],
  );

  return useMemo(
    () => ({
      fileInputRef,
      files,
      onFileInputChange,
      removeFile,
      updateFile,
    }),
    [files, onFileInputChange, removeFile, updateFile],
  );
};
