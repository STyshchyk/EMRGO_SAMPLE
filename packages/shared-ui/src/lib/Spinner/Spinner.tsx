import React, { FC } from "react";

import { CircularProgress } from "@mui/material";

export const Spinner: FC = ({}) => {
  return (
    <div className={"flex justify-center items-center h-full w-full"}>
      <CircularProgress color="primary" />
    </div>
  );
};
