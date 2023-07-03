import { FC, useEffect, useRef, useState } from "react";

import { isNumeric } from "@emrgo-frontend/utils";

import * as Styles from "./CodeInput.styles";
import { ICodeInputProps } from "./CodeInput.types";

const six = Array.from({ length: 6 }).map((_, i) => i);

/* Generate a string representation for onChange */
const getValue = (values: string[]) => values.map((val) => (isNumeric(val) ? val : "-")).join("");

export const CodeInput: FC<ICodeInputProps> = ({
  onChange,
  value,
  variant,
  focus,
  error,
  success,
  label,
  size = "medium",
}) => {
  const inputRefs = six.map(() => useRef<HTMLInputElement | null>(null));
  const [values, setValues] = useState<string[]>([]);

  /* Focus the first input if focus is true */
  useEffect(() => {
    if (focus) {
      inputRefs[0].current?.focus();
    }
  }, [focus]);

  /* Create an intermediate array representation 
  of the string value that is easier to work with */
  useEffect(() => {
    const splitValues = value?.split("") || [];
    const newValues: string[] = [];
    splitValues.forEach((value, i) => {
      if (isNumeric(value)) newValues[i] = value;
    });
    setValues(newValues);
  }, [value]);

  /*generate an ID for the input */
  const getId = (index: number) => `six-digit-code-${index}`;

  /* Focus the next input */
  const focusNext = (index: number) => {
    const nextInputRef = inputRefs[index + 1];
    if (nextInputRef) {
      nextInputRef.current?.focus();
    }
  };

  /* Focus the last input */
  const focusLast = () => {
    const lastInputRef = inputRefs[inputRefs.length - 1];
    if (lastInputRef) {
      lastInputRef.current?.focus();
    }
  };

  /* If a six digit code is pasted into any input, map it to the correct fields */
  const pasteCode = (code: string) => {
    const codeArray = code.split("");
    inputRefs.forEach((ref, index) => {
      ref.current!.value = codeArray[index];
    });
  };

  /* Select the input value on focus */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  /* Handle Input event rather than Change Event
  as we always want to move to the next input 
  even if the value is the same */
  const handleOnInput = (event: React.FormEvent<HTMLInputElement>, index: number) => {
    const target = event.target as HTMLInputElement;

    //The user has typed a single value
    if (target.value.length === 1) {
      focusNext(index);
    }

    // The user has pasted a six digit code
    else if (target.value.length === 6) {
      pasteCode(target.value);
      focusLast();
    }

    // The user has somehow typed mutiple values, perhaps a paste or autocomplete or some other interaction.
    // Discard all but the last value
    else {
      target.value = target.value[target.value.length - 1];
      focusNext(index);
    }

    // update the intermediate representation of the value
    const newValues = inputRefs.map((ref) =>
      isNumeric(ref.current!.value) ? ref.current!.value : "-"
    );
    setValues(newValues);

    // Call onChange with the new string value
    onChange && onChange(getValue(newValues));
  };

  return (
    <Styles.CodeInput>
      {error && <Styles.Error htmlFor={getId(0)}>{error}</Styles.Error>}
      {success && <Styles.Success htmlFor={getId(0)}>{success}</Styles.Success>}
      {!error && !success && <Styles.Label htmlFor={getId(0)}>{label}</Styles.Label>}
      <Styles.InputWrapper>
        {six.map((index) => (
          <Styles.Input
            key={index}
            type="number"
            id={getId(index)}
            max="9"
            min="0"
            maxLength={1}
            value={isNumeric(values[index]) ? values[index] : ""}
            onInput={(e) => handleOnInput(e, index)}
            onFocus={handleFocus}
            ref={inputRefs[index]}
            $variant={variant}
            $error={!!error}
            $success={!!success}
            $size={size}
          />
        ))}
      </Styles.InputWrapper>
    </Styles.CodeInput>
  );
};
