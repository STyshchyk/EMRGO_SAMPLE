import { ICustomComponent } from "../Select/Select.types";

export interface IMySelectProps {
  error?: string | boolean;
  maxWidth?: number;
  components?: ICustomComponent;
  variant?: TSelectVariants;
  type?: TSelectType;
}
type TSelectVariants = "default" | "signup";
type TSelectType = "standard" | "filled";
