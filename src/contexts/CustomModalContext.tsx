import { ModalProps } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

export interface CustomModalProps<T extends Record<string, unknown>>
  extends ModalProps {
  modalId: string;
  innerProps: T;
}

export interface CustomModalContextType {
  modals: Record<string, ReactNode>;
  openCustomModal: <T extends Record<string, unknown>>(
    modalId: string,
    props: Partial<T>,
  ) => void;
  closeCustomModal: (modalId: string) => void;
}

const CustomModalContext = createContext<CustomModalContextType>({
  modals: {},
  openCustomModal: () => {},
  closeCustomModal: () => {},
});

interface CustomModalProviderProps extends PropsWithChildren {
  customModals: Record<string, FC<CustomModalProps<any>>>;
}

export const CustomModalProvider: FC<CustomModalProviderProps> = ({
  children,
  customModals,
}) => {
  const [modals, setModals] = useSetState({});

  const closeCustomModal = useCallback(
    (modalId: string) => {
      setModals({
        [modalId]: undefined,
      });
    },
    [setModals],
  );

  const openCustomModal = useCallback(
    <T extends Record<string, unknown>>(modalId: string, props: Partial<T>) => {
      if (customModals[modalId]) {
        const NewModal = customModals[modalId];

        const onClose = () => closeCustomModal(modalId);

        setModals({
          [modalId]: (
            <NewModal
              key={`modal--${modalId}`}
              opened
              onClose={onClose}
              modalId={modalId}
              innerProps={props}
            />
          ),
        });
      }
    },
    [closeCustomModal, customModals, setModals],
  );

  const value = useMemo(
    () => ({
      modals,
      openCustomModal,
      closeCustomModal,
    }),
    [closeCustomModal, modals, openCustomModal],
  );

  const displayedModals = useMemo(
    () =>
      Object.values(modals)
        .filter((modal) => !!modal)
        .map((modal) => modal),
    [modals],
  );

  return (
    <CustomModalContext.Provider value={value}>
      <>
        {children}
        {displayedModals}
      </>
    </CustomModalContext.Provider>
  );
};

export const useCustomModal = () => useContext(CustomModalContext);
