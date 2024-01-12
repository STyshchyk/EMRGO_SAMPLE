import React, {
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

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
    maxHeight,
    type,
    disabled,
    variant,
    autoResize,
    onSendClick,
    onAttachlick,
    children,
  },
  ref
) => {
  const [hasFocus, setHasFocus] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const componentId = useId();
  const idValue = id || componentId;

  const active = !!value || hasFocus || !!textAreaRef.current?.value.length;

  useEffect(() => {
    if (hasFocus) {
      textAreaRef.current?.focus();
    }
  }, [hasFocus]);

  useEffect(() => {
    if (textAreaRef.current && autoResize) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = "30px";
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
  const focus = () => {
    setHasFocus(true);
  };

  const blur = () => {
    setHasFocus(false);
  };

  return (
    <>
      <Styles.Wrapper $maxWidth={maxWidth} $maxHeight={maxHeight}>
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
              ref={textAreaRef}
              $autoResize={autoResize}
              $active={active}
              $disabled={disabled}
              disabled={disabled}
              id={idValue}
              rows={5}
              cols={cols}
              onChange={onChange}
              $maxWidth={maxWidth}
              $maxHeight={maxHeight}
              name={idValue}
              onFocus={(e) => {
                focus();
                onFocus && onFocus(e);
              }}
              onBlur={(e) => {
                blur();
                onBlur && onBlur(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  if (onSendClick) {
                    onSendClick();
                  }
                }
              }}
              variant={variant}
            ></Styles.Input>
            {autoResize && children && <Styles.AttachedFiles>{children}</Styles.AttachedFiles>}
            {autoResize && (
              <Styles.ActionButtons>
                <AttachFileIcon
                  fontSize={"small"}
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current?.click();
                  }}
                />
                <SendIcon
                  color={value ? "primary" : "disabled"}
                  onClick={() => {
                    if (value && onSendClick) {
                      onSendClick();
                    }
                  }}
                />
              </Styles.ActionButtons>
            )}
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
      <input
        type="file"
        ref={fileInputRef}
        name={"file"}
        accept="image/jpg, image/jpeg, image/png, application/pdf, .csv, .doc, .docx, .xls, .xlsx, .csv"
        style={{ display: "none" }}
        onChange={(e) => {
          if (onAttachlick) onAttachlick(e);
          e.target.value = null;
        }}
      />
    </>
  );
};

export const MyTextArea = forwardRef(InputComponent);
