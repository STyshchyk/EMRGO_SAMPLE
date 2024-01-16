import React, { FC } from "react";

import { BytesFormmater } from "@emrgo-frontend/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";
import Chip from "@mui/material/Chip";

import * as Styles from "./AttachedFile.styles";
import { IAttachedFileProps } from "./AttachedFile.types";

export const AttachedFile: FC<IAttachedFileProps> = ({
  file,
  index,
  handleFileDelete,
  variant = "elevated",
  onClick,
}) => {
  return (
    <Styles.AttachedFile>
      <Chip
        icon={file?.isLoading ? <CircularProgress size={15} /> : <></>}
        label={
          <Styles.InfoWrapper>
            <span>{file?.file.name ?? "testName"}</span>
            <span>{BytesFormmater(file?.file.size)}</span>
          </Styles.InfoWrapper>
        }
        onClick={() => {
          if (onClick) onClick();
        }}
        onDelete={() => {
          if (handleFileDelete) handleFileDelete(index);
        }}
        sx={{
          borderRadius: "4px",
          height: "42px",
        }}
        deleteIcon={handleFileDelete ? <DeleteIcon /> : <></>}
        variant={"outlined"}
        size={"medium"}
        color={"primary"}
      />
    </Styles.AttachedFile>
  );
};
