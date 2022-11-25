import { Account, MastoClient, WsEvents } from "masto";
import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface Streams {
  user: WsEvents;
  global: WsEvents;
  local: WsEvents;
}

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
  user: Account;
  setUser: Dispatch<React.SetStateAction<Account>>;
  currentTimeline: TimelineType;
  setCurrentTimeline: Dispatch<React.SetStateAction<TimelineType>>;
  scrollAreaRef: React.MutableRefObject<HTMLDivElement | null>;
  apiClient: MastoClient;
  setApiClient: React.Dispatch<React.SetStateAction<MastoClient>>;
  streams: Streams;
}

const AppContext = createContext<AppContextType>({} as any);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [user, setUser] = useState<Account>({} as Account);
  const [currentTimeline, setCurrentTimeline] = useState<TimelineType>(
    TimelineType.None,
  );
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [apiClient, setApiClient] = useState<MastoClient>(undefined as any);
  const [streams, setStreams] = useState<Streams>({} as any);

  useEffect(() => {
    if (apiClient) {
      (async () => {
        setStreams({
          user: await apiClient.stream.streamUser(),
          global: await apiClient.stream.streamPublicTimeline(),
          local: await apiClient.stream.streamCommunityTimeline(),
        });
      })();
    }

    return () => {
      Object.keys(streams).forEach((key) =>
        streams[key as keyof Streams].disconnect(),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClient]);

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
      streams,
    }),
    [apiClient, currentTimeline, isNavbarOpen, streams, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
