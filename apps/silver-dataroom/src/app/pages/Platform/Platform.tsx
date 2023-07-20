import { FC } from "react";

import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { DataRoom } from "../DataRoom";
import { PlatformComponent } from "./Platform.component";
import { PlatformProvider } from "./Platform.provider";
import { IPlatformProps } from "./Platform.types";

export const Platform: FC<IPlatformProps> = ({}: IPlatformProps) => {
  return (
    <PlatformProvider>
      <PlatformComponent />
    </PlatformProvider>
  );
};
