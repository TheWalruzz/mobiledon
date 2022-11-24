import { Mastodon } from "megalodon";
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
  Hashtag = "Hashtag",
}

export interface AppContextType {
  isNavbarOpen: boolean;
  setNavbarOpen: Dispatch<React.SetStateAction<boolean>>;
  user: Entity.Account;
  setUser: Dispatch<React.SetStateAction<Entity.Account>>;
  currentTimeline: TimelineType;
  setCurrentTimeline: Dispatch<React.SetStateAction<TimelineType>>;
  scrollAreaRef: React.MutableRefObject<HTMLDivElement | null>;
  apiClient: Mastodon;
  setApiClient: React.Dispatch<React.SetStateAction<Mastodon>>;
}

const AppContext = createContext<AppContextType>({} as any);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [user, setUser] = useState<Entity.Account>({} as Entity.Account);
  const [currentTimeline, setCurrentTimeline] = useState<TimelineType>(
    TimelineType.None,
  );
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [apiClient, setApiClient] = useState<Mastodon>({} as any);

  const value = useMemo(
    () => ({
      isNavbarOpen,
      setNavbarOpen,
      user,
      setUser,
      currentTimeline,
      setCurrentTimeline,
      scrollAreaRef,
      apiClient,
      setApiClient,
    }),
    [apiClient, currentTimeline, isNavbarOpen, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
