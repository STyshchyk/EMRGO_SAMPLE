export interface IModalShadeProps {
  children?: React.ReactNode;
  onClick?: () => void;
  shaded?: boolean;
}

export interface IModalShadeStylesProps {
  $reveal: boolean;
  $shaded?: boolean;
}
