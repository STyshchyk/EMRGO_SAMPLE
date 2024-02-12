import React, { FC } from "react";

import { viewFile } from "@emrgo-frontend/services";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";
import Chip from "@mui/material/Chip";
import { useMutation } from "@tanstack/react-query";

import * as Styles from "./AttachedFile.styles";
import { IAttachedFileProps } from "./AttachedFile.types";
import { FileIcon } from "./FileIcon";

export const AttachedFile: FC<IAttachedFileProps> = ({
  size,
  fileName,
  isLoading,
  index,
  color,
  handleFileDelete,
  variant = "outlined",
  onClick,
  file,
}) => {
  const name_draft = fileName || "test_name.pdf";
  const fileType = name_draft ? name_draft.split(".").pop() : "empty";
  const size_draf = size || "100Kib";

  const { mutate } = useMutation(viewFile);

  return (
    <Styles.AttachedFile>
      <Chip
        icon={
          isLoading ? (
            <CircularProgress size={15} />
          ) : (
            <FileIcon name={fileType ?? ""} className={"ml-2"} />
          )
        }
        label={
          <Styles.InfoWrapper>
            <span>{name_draft}</span>
            <span>{size_draf}</span>
          </Styles.InfoWrapper>
        }
        onClick={(e) => {
          e.stopPropagation();
          mutate(file.url);
          if (onClick) onClick();
        }}
        onDelete={() => {
          if (handleFileDelete) handleFileDelete(index);
        }}
        sx={{
          borderRadius: "4px",
          height: "42px",
          "& .MuiChip-label": {
            paddingLeft: "0.5rem !important",
          },
        }}
        deleteIcon={handleFileDelete ? <DeleteIcon /> : <></>}
        variant={variant ?? "outlined"}
        size={"medium"}
        color={color ?? "primary"}
      />
    </Styles.AttachedFile>
  );
};
