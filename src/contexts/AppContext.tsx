import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export enum TimelineType {
  None = "None",
  Home = "Home",
  Local = "Local",
  Global = "Global",
}

export interface AppContextType {
  isNavbarOpen: boolean;
  setNavbarOpen: Dispatch<React.SetStateAction<boolean>>;
  user: Entity.Account;
  setUser: Dispatch<React.SetStateAction<Entity.Account>>;
  currentTimeline: TimelineType;
  setCurrentTimeline: Dispatch<React.SetStateAction<TimelineType>>;
  scrollAreaRef: React.MutableRefObject<HTMLDivElement | null>;
}

const AppContext = createContext<AppContextType>({} as any);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [user, setUser] = useState<Entity.Account>({} as Entity.Account);
  const [currentTimeline, setCurrentTimeline] = useState<TimelineType>(
    TimelineType.None,
  );
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const value = useMemo(
    () => ({
      isNavbarOpen,
      setNavbarOpen,
      user,
      setUser,
      currentTimeline,
      setCurrentTimeline,
      scrollAreaRef,
    }),
    [currentTimeline, isNavbarOpen, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
