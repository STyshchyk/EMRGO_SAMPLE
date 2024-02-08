import { ICustomComponent } from "../Select/Select.types";

export interface IMySelectProps {
  error?: string | boolean;
  maxWidth?: number;
  components?: ICustomComponent;
  variant?: TSelectVariants;
  border?: boolean;
}
type TSelectVariants = "default" | "signup";
