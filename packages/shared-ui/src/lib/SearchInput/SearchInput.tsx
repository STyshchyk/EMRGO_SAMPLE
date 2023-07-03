import { FC, forwardRef, useRef, useState } from "react";

import { setComponentRefs } from "@emrgo-frontend/utils";
import isUndefined from "lodash/isUndefined";

import { CloseIcon, SearchIcon } from "../Icons";
import * as Styles from "./SearchInput.styles";
import { ISearchInputProps } from "./SearchInput.types";

// NOTE: This hack is needed to align with the native HTMLInputElement API, more
// specifically it's used to manually change the input value and trigger appropriate
// events that are actually handled by the react event handlers.
// This implementation is entirely based on the example provided in this reply from
// Dan Abramov https://stackoverflow.com/a/47400176
//
// Overall, this breaks the abstraction and ties this solution to the current input change
// handling implementation in the React library. So if it changes in the react implementation, this may
// stop working. Since this is used only for clearing an input field, it feels like an acceptable
// trade-off in order to keep aligned with the HTMLInputElement API, at least for now.
const clearInput = (input: HTMLInputElement) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "");
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

export const SearchInput: FC<ISearchInputProps> = forwardRef<HTMLInputElement, ISearchInputProps>(
  ({ value, onChange, ...inputProps }, ref) => {
    const [internalValue, setInternalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const isClearButtonVisible = Boolean(value) || (isUndefined(value) && Boolean(internalValue));

    const clear = () => {
      if (inputRef.current) {
        clearInput(inputRef.current);
      }
    };

    return (
      <Styles.Container>
        <Styles.Input
          placeholder="Search by..."
          autoCorrect="off"
          autoCapitalize="off"
          enterKeyHint="search"
          spellCheck={false}
          {...inputProps}
          type="search"
          ref={setComponentRefs(inputRef, ref)}
          value={value}
          onChange={(event) => {
            setInternalValue(event.target.value);
            onChange?.(event);
          }}
          $isClearButtonVisible={isClearButtonVisible}
        />

        <Styles.Icon>
          <SearchIcon />
        </Styles.Icon>

        {isClearButtonVisible && (
          <Styles.ClearButton onClick={clear}>
            <CloseIcon />
          </Styles.ClearButton>
        )}
      </Styles.Container>
    );
  }
);
