import { useSelect as useDownshiftSelect } from "downshift";

import { IDropdownItem, IDropdownProps } from "./Dropdown.types";

const itemToString = (item: IDropdownItem<unknown> | null) => {
  return item?.label ?? "";
};

export const useSelect = <ValueType>({ items, value, onChange }: IDropdownProps<ValueType>) => {
  return useDownshiftSelect({
    items,
    itemToString,
    defaultSelectedItem: items[0],
    selectedItem: items.find((item) => item.value === value || item.key === value),
    onSelectedItemChange(changes) {
      // console.log("🚀 ~ file: useSelect.ts:16 ~ onSelectedItemChange ~ changes:", changes)
      // if (changes.selectedItem) {
      //   onChange?.(changes.selectedItem.value);
      // }
    },
  });
};
