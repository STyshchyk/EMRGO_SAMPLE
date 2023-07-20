import { Hyperlink, Modal } from "@emrgo-frontend/shared-ui";
import { getTheme } from "@emrgo-frontend/theme";
import { rem } from "polished";
import styled, { css } from "styled-components";

export const SetupTwoFactorAuthenticationModal = styled(Modal)`
  padding: ${rem(16)};
  width: 100%;
  max-width: ${rem(1500)};
`;

export const BackButton = styled.button`
  appearance: none;
  border: none;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: ${rem(24)} 0 ${rem(48)};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: ${rem(32)};
  padding: 0 ${rem(64)};

  & + & {
    border-left: 1px solid transparent;

    ${({ theme }) =>
      theme.mode === "light" &&
      css`
        border-left-color: ${getTheme("colors.strokes.light")};
      `}

    ${({ theme }) =>
      theme.mode === "dark" &&
      css`
        border-left-color: ${getTheme("colors.strokes.dark")};
      `}
  }
`;

export const Header = styled.header``;

export const Title = styled.h2`
  margin: 0;
  margin-bottom: ${rem(8)};
  text-align: center;
  ${getTheme("typography.heading.02")}
`;

export const Description = styled.p`
  margin: 0;
  text-align: center;
  ${getTheme("typography.medium.01")}

  ${({ theme }) =>
    theme.mode === "light" &&
    css`
      color: ${getTheme("colors.black.60")};
    `}

  ${({ theme }) =>
    theme.mode === "dark" &&
    css`
      color: ${getTheme("colors.white.60")};
    `}
`;

export const QRCodeWrapper = styled.div`
  background-color: ${getTheme("colors.white.100")};
  width: 50%;
  max-width: ${rem(224)};
  padding: ${rem(8)};
  border-radius: ${rem(4)};
`;

export const DownloadInstructions = styled(Description)`
  ${getTheme("typography.medium.03Tight")}
`;

export const SupportLink = styled(Hyperlink)`
  ${getTheme("typography.medium.03Tight")}
`;
