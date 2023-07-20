import React, {
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
import { IInputFileProps } from "./InputFile.types";

const InputComponent: ForwardRefRenderFunction<
  HTMLInputElement,
  IInputFileProps & HTMLProps<HTMLInputElement>
> = (
  {
    onChange,
    accept,
    onBlur,
    onFocus,
    error,
    label,
    helperText,
    value,
    disabled,
    valid,
    id,
    maxWidth,
    type,
  },
  ref
) => {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const reactId = useId();
  const idValue = id || reactId;

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
    <Styles.Wrapper $maxWidth={maxWidth}>
      <Styles.InputContainer $active={active} $error={!!error} $hasFocus={hasFocus} onClick={focus}>
        <Styles.InputContainerWrapper>
          <Styles.Label $active={active} $hasFocus={hasFocus} $error={!!error} htmlFor={idValue}>
            {label}
          </Styles.Label>
          <Styles.Input
            $active={active}
            id={idValue}
            accept={accept}
            disabled={disabled}
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
          />
          <Styles.UploadIcon size={25} $error={!!error} $valid={!!value && !!value?.name} />
          {value && value?.name && <Styles.Span>{value.name}</Styles.Span>}
        </Styles.InputContainerWrapper>
        {valid && <Styles.CheckNotificationIcon />}
      </Styles.InputContainer>
      {!error && !!helperText && <Styles.HelperText>{helperText}</Styles.HelperText>}
      {!!error && (
        <Styles.Error>
          <Styles.ErrorIcon />
          <span>{error}</span>
        </Styles.Error>
      )}
    </Styles.Wrapper>
  );
};

export const InputFile = forwardRef(InputComponent);
