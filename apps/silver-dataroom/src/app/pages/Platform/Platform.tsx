import { FC } from "react";

import { PlatformComponent } from "./Platform.component";
import { PlatformProvider } from "./Platform.provider";
import { IPlatformProps } from "./Platform.types";
import { DataRoom } from "../DataRoom";
import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

export const Platform: FC<IPlatformProps> = ({}: IPlatformProps) => {
  return (
        <PlatformProvider>
          <PlatformComponent />
        </PlatformProvider>
  );
};
