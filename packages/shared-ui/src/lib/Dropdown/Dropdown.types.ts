import { IDropdown } from "@emrgo-frontend/types";

export interface IDropdownItem<ValueType> {
  value: ValueType;
  label: string;
}

export interface IDropdownProps<ValueType> {
  /** The list of dropdown items */
  items: IDropdown[];
  /** The current dropdown value */
  value?: ValueType;
  /** Callback fired when a dropdown item is selected. */
  onChange?: (value: ValueType) => void;
}
