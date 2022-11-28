import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { useListState } from "@mantine/hooks";
import { useAppContext } from "../contexts/AppContext";
import { Attachment } from "masto";

export const useFileUpload = (initialValue: Attachment[] = []) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { apiClient } = useAppContext();
  const [files, handlers] = useListState<Attachment>(initialValue);
  const [processing, setProcessing] = useState(false);

  const onFileInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget?.files) {
        setProcessing(true);
        const filesArr = Array.from(e.currentTarget.files).map((file) => ({
          file,
          description: "",
        }));
        const newFiles = await Promise.all(
          filesArr.map(({ file, description }) =>
            apiClient.mediaAttachments.create({
              file,
              description,
            }),
          ),
        );
        handlers.append(...newFiles);
        if (fileInputRef.current) {
          (fileInputRef.current.value as any) = null;
        }
        setProcessing(false);
      }
    },
    [apiClient.mediaAttachments, handlers],
  );

  const removeFile = useCallback(
    async (index: number) => {
      handlers.remove(index);
    },
    [handlers],
  );

  const updateFile = useCallback(
    async (index: number, { id, ...file }: Attachment) => {
      setProcessing(true);
      const updatedFile = await apiClient.mediaAttachments.update(id, {
        description: file.description,
        focus: file.meta?.focus
          ? `${file.meta.focus.x ?? 0},${file.meta.focus.y ?? 0}`
          : undefined,
      });
      handlers.setItem(index, updatedFile);
      setProcessing(false);
    },
    [apiClient.mediaAttachments, handlers],
  );

  const removeAllFiles = useCallback(async () => {
    handlers.setState([]);
  }, [handlers]);

  return useMemo(
    () => ({
      fileInputRef,
      files,
      onFileInputChange,
      removeFile,
      updateFile,
      removeAllFiles,
      processing,
    }),
    [
      files,
      onFileInputChange,
      processing,
      removeAllFiles,
      removeFile,
      updateFile,
    ],
  );
};
