import { IUploadAttachemnt } from "@emrgo-frontend/types";

export interface IAttachedFileProps {
  isLoading?: boolean;
  fileName: string;
  size: string;
  index: number;
  onClick?: () => void;
  handleFileDelete?: (index: string | number) => void;
  variant?: TVariant;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  file: IUploadAttachemnt;
}

type TVariant = "filled" | "outlined";
