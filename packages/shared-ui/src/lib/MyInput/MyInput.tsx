import { forwardRef, ForwardRefRenderFunction, HTMLProps, useEffect, useId, useRef, useState } from "react";

import * as Styles from "./MyInput.styles";
import { IMyInputProps } from "./MyInput.types";

const InputComponent: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  IMyInputProps & HTMLProps<HTMLTextAreaElement>
> = (
  {
    onChange,
    onBlur,
    onFocus,
    error,
    label,
    helperText,
    value,
    valid,
    rows,
    cols,
    id,
    maxWidth,
    type,
    disabled,
    variant
  },
  ref
) => {
  const [hasFocus, setHasFocus] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const componentId = useId();
  const idValue = id || componentId;

  const active = !!value || hasFocus || !!textAreaRef.current?.value.length;

  useEffect(() => {
    if (hasFocus) {
      textAreaRef.current?.focus();
    }
  }, [hasFocus]);

  const focus = () => {
    setHasFocus(true);
  };

  const blur = () => {
    setHasFocus(false);
  };

  return (
    <Styles.Wrapper $maxWidth={maxWidth}>
      <Styles.InputContainer
        $active={active}
        $error={!!error}
        $hasFocus={hasFocus}
        onClick={focus}
        $disabled={disabled}
        variant={variant}
      >
        <Styles.InputContainerWrapper>
          <Styles.Label
            $active={active}
            $hasFocus={hasFocus}
            $error={!!error}
            htmlFor={idValue}
            variant={variant}
          >
            {label}
          </Styles.Label>
          <Styles.Input
            value={value}
            $active={active}
            $disabled={disabled}
            disabled={disabled}
            id={idValue}
            rows={rows}
            cols={cols}
            onChange={onChange}
            $maxWidth={maxWidth}
            name={idValue}
            onFocus={(e) => {
              focus();
              onFocus && onFocus(e);
            }}
            onBlur={(e) => {
              blur();
              onBlur && onBlur(e);
            }}
            variant={variant}
          ></Styles.Input>
        </Styles.InputContainerWrapper>
        {valid && <Styles.CheckNotificationIcon variant={variant} />}
      </Styles.InputContainer>
      {!error && !!helperText && (
        <Styles.HelperText variant={variant}>{helperText}</Styles.HelperText>
      )}
      {!!error && (
        <Styles.Error>
          <Styles.ErrorIcon />
          <span>{error}</span>
        </Styles.Error>
      )}
    </Styles.Wrapper>
  );
};

export const MyInput = forwardRef(InputComponent);
