import React, { FC } from "react";

import ArticleIcon from "@mui/icons-material/Article";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import ImageIcon from "@mui/icons-material/Image";
import ListIcon from "@mui/icons-material/List";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const FileIcon: FC<{ name: string }> = ({ name }) => {
  const FileIcon = {
    pdf: <PictureAsPdfIcon />,
    jpg: <ImageIcon />,
    png: <ImageIcon />,
    jpeg: <ImageIcon />,
    doc: <ArticleIcon />,
    docx: <ArticleIcon />,
    xls: <ListIcon />,
    "xlsx ": <ListIcon />,
    csv: <ListIcon />,
    empty: <FileOpenIcon />,
  };
  const FileIconSelected = FileIcon[name];
  return <>{FileIconSelected}</>;
};
