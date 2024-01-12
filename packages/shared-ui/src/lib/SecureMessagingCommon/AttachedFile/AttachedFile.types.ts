export interface IAttachedFileProps {
  file: { file: File; isLoading: boolean };
  index: number;
  onClick?: () => void;
  handleFileDelete?: (index: string | number) => void;
  variant?: TVariant;
}

type TVariant = "filled" | "outlined";
