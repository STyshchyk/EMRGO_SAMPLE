import { ErrorIcon as ErrorIconBase } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};
  padding: ${rem(92)} 0;
  min-height: 100vh;
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const Error = styled.div`
  /* Layout */
  display: flex;
  gap: ${rem(4)};
  align-items: center;
  min-height: ${rem(24)};

  /* Font Styles */
  font-weight: 500;
  font-size: ${rem(12)};
  line-height: ${rem(24)};
  span {
    color: ${getTheme("colors.white.80")};
  }
`;

export const ErrorIcon = styled(ErrorIconBase)`
  color: ${getTheme("colors.orange")};
  width: ${rem(24)};
  height: ${rem(24)};
`;


export const Form = styled.div<{ $isAligned?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
  max-width: ${rem(500)};


  ${({ $isAligned }) => {
    if ($isAligned) return (css`
      justify-content: center;
      align-items: center;
    `);

    }
  }
`;


export const HelpListItem = styled.li`
    margin: 0;
    padding: 0;
    list-style: none;

    ${getTheme("typography.regular.02")}
  `
;
export const BackButton = styled.button`
    position: absolute;
    top: 0;
    left: 0;
    /* Layout */
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${rem(32)};
    height: ${rem(32)};
    padding: 0;

    /* Element Styles */
    border: none;
    background-color: ${getTheme("colors.white.20")};
    border-radius: 50%;

    /* Interaction Styles */
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: ${getTheme("colors.white.30")};
    }
  `
;
