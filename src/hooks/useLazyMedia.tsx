import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useLazyMedia = <T extends Element = HTMLImageElement>(
  src: string,
  placeholderSrc: string,
) => {
  const elementRef = useRef<T>(null);
  const [loaded, setLoaded] = useState(false);
  const currentSrc = useMemo(
    () => (loaded ? src : placeholderSrc),
    [loaded, placeholderSrc, src],
  );

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const element = elementRef.current?.cloneNode() as T;
    if (element) {
      (element as any).src = src;
      element.addEventListener("load", onLoad);
    }

    return () => {
      element?.removeEventListener("load", onLoad);
      element?.remove();
    };
  }, [onLoad, elementRef, src]);

  return useMemo(
    () => ({ ref: elementRef, src: currentSrc, loaded }),
    [currentSrc, loaded],
  );
};
