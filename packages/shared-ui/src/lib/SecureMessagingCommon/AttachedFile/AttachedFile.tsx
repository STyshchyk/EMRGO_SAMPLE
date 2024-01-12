import React, { FC } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";
import Chip from "@mui/material/Chip";

import * as Styles from "./AttachedFile.styles";
import { IAttachedFileProps } from "./AttachedFile.types";

export const AttachedFile: FC<IAttachedFileProps> = ({
  file,
  index,
  handleFileDelete,
  variant = "filled",
  onClick,
}) => {
  return (
    <Styles.AttachedFile>
      <Chip
        icon={file?.isLoading ? <CircularProgress size={15} /> : <></>}
        label={file?.file.name ?? "file"}
        onClick={() => {
          if (onClick) onClick();
        }}
        onDelete={() => {
          if (handleFileDelete) handleFileDelete(index);
        }}
        sx={{
          borderRadius: "4px",
        }}
        deleteIcon={handleFileDelete ? <DeleteIcon /> : <></>}
        variant={variant}
        color={"primary"}
      />
    </Styles.AttachedFile>
  );
};
