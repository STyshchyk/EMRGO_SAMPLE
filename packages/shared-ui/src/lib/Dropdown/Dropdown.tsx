import { Key } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "../Icons";
import * as Styles from "./Dropdown.styles";
import { IDropdownProps } from "./Dropdown.types";
import { useFloating } from "./useFloating";
import { useSelect } from "./useSelect";

export const Dropdown = <ValueType extends Key>(props: IDropdownProps<ValueType>) => {
  const { items } = props;

  const {
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    isOpen,
    getItemProps,
    highlightedIndex,
  } = useSelect(props);

  const { x, y, strategy, refs } = useFloating();

  return (
    <Styles.Container>
      <Styles.SelectButton {...getToggleButtonProps({ ref: refs.setReference })} $isOpen={isOpen}>
        <Styles.SelectButtonLabel title={selectedItem?.label}>
          {selectedItem?.label}
        </Styles.SelectButtonLabel>

        <Styles.SelectButtonIcon>
          {!isOpen && <ChevronDownIcon />}
          {isOpen && <ChevronUpIcon />}
        </Styles.SelectButtonIcon>
      </Styles.SelectButton>

      <Styles.Menu
        {...getMenuProps({ ref: refs.setFloating })}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          minWidth: refs.reference.current?.getBoundingClientRect().width,
        }}
      >
        {isOpen && (
          <Styles.Options>
            {items.map((item, index) => (
              <Styles.Option
                key={item.value}
                {...getItemProps({ item, index })}
                $isHighlighted={highlightedIndex === index}
                $isSelected={selectedItem === item}
              >
                {item.label}
              </Styles.Option>
            ))}
          </Styles.Options>
        )}
      </Styles.Menu>
    </Styles.Container>
  );
};
