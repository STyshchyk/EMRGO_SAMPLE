import React, { FC } from "react";

import ArticleIcon from "@mui/icons-material/Article";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import ImageIcon from "@mui/icons-material/Image";
import ListIcon from "@mui/icons-material/List";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const FileIcon: FC<{ name: string; className: string }> = ({ name, className }) => {
  const FileIcon = {
    pdf: <PictureAsPdfIcon className={className} />,
    jpg: <ImageIcon className={className} />,
    png: <ImageIcon className={className} />,
    jpeg: <ImageIcon className={className} />,
    doc: <ArticleIcon className={className} />,
    docx: <ArticleIcon className={className} />,
    xls: <ListIcon className={className} />,
    xlsx: <ListIcon className={className} />,
    csv: <ListIcon className={className} />,
    empty: <FileOpenIcon className={className} />,
  };
  const FileIconSelected = FileIcon[name];
  return <>{FileIconSelected}</>;
};
