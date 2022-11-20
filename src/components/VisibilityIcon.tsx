import { IconAt, IconLock, IconLockOpen, IconWorld } from "@tabler/icons";
import { FC, useMemo } from "react";

export type Visibility = "public" | "private" | "unlisted" | "direct";

const visibilityIcons = {
  public: IconWorld,
  private: IconLock,
  unlisted: IconLockOpen,
  direct: IconAt,
};

interface VisibilityIconProps {
  visibility: Visibility;
  size: number;
}

export const VisibilityIcon: FC<VisibilityIconProps> = ({
  visibility,
  size,
}) => {
  const Icon = useMemo(() => visibilityIcons[visibility], [visibility]);

  return <Icon style={{ display: "block" }} size={size} />;
};
