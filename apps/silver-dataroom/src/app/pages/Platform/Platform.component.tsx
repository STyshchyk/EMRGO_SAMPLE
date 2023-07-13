import { FC } from "react";

import { DashboardContent } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { getDataRoomDocuments } from "../DataRoom.service";
import * as Styles from "./Platform.styles";
import { IPlatformProps } from "./Platform.types";
import { PlatformDocument } from "./PlatformDocument";

export const PlatformComponent: FC<IPlatformProps> = ({}: IPlatformProps) => {
  const { data, isError } = useQuery([queryKeys.document.platform], {
      queryFn: () => getDataRoomDocuments(),
      onSuccess: (res) => {
        console.log(res);
      }
    }
  );
  return (
    <Styles.Platform>
      <DashboardContent>
        <Styles.PlatformWrapper>
          {data && !isError && data.map(document =>
            <PlatformDocument
              name={document.name}
              id={document.id}
              path={document.path}
              lastUpdatedDate={document.lastUpdatedDate}
              version={document.version}
              type={document.type}
              key={document.id}
            />
          )}
        </Styles.PlatformWrapper>
      </DashboardContent>
    </Styles.Platform>
  );
};
