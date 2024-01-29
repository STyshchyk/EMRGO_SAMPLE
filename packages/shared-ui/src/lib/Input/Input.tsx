import {
  FocusEvent,
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { setComponentRefs } from "@emrgo-frontend/utils";

import * as Styles from "./Input.styles";
import { IInputProps } from "./Input.types";

const InputComponent: ForwardRefRenderFunction<
  HTMLInputElement,
  IInputProps & HTMLProps<HTMLInputElement>
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
    id,
    maxWidth,
    className,
    type,
    disabled,
    variant,
    autoFocus,
    readOnly,
  },
  ref
) => {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const idCase = useId();
  const idValue = id || idCase;

  const active = !!value || hasFocus || !!inputRef.current?.value.length;

  useEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
    }
  }, [hasFocus]);

  const focus = () => {
    setHasFocus(true);
  };

  const blur = () => {
    setHasFocus(false);
  };

  return (
    <Styles.Wrapper $maxWidth={maxWidth} className={className}>
      <Styles.InputContainer
        $active={active}
        $error={!!error}
        $hasFocus={hasFocus}
        onClick={() => {
          if (!disabled) {
            focus();
          }
        }}
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
            name={idValue}
            ref={setComponentRefs(inputRef, ref)}
            onChange={onChange}
            onFocus={(e: FocusEvent<HTMLInputElement>) => {
              focus();
              onFocus && onFocus(e);
            }}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              blur();
              onBlur && onBlur(e);
            }}
            type={type}
            variant={variant}
            autoFocus={autoFocus}
            readOnly={readOnly}
          />
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

export const Input = forwardRef(InputComponent);
