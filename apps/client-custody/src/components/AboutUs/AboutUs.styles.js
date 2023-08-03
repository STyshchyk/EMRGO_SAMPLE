import { rem } from "polished";
import styled, { css } from "styled-components";

import colors from "../../constants/Theme/colors";

export const Container = styled.section`
  padding: ${rem(16)};
  border: 0 solid transparent;
  border-radius: ${rem(4)};
  background-color: ${colors.green1};
  color: ${colors.white["70"]};
  border-color: ${colors.green2};
  height: calc(187px - 32px);
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${colors.white["100"]};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: rem(16);
  line-height: rem(24);
  font-weight: 600;
`;

export const CloseButton = styled.button`
  display: inline-flex;
  appearance: none;
  cursor: pointer;
  padding: 0;
  background-color: transparent;
  border: none;
  font-size: ${rem(24)};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${rem(16)};
  padding-top: ${rem(8)};
`;

export const Text = styled.p`
  margin: 0;
  font-size: rem(12);
  line-height: rem(16);
  font-weight: 400;
`;

export const Features = styled.ul`
  display: flex;
  column-gap: ${rem(40)};
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Feature = styled.li`
  display: inline-flex;
  column-gap: ${rem(8)};
  align-items: center;
  font-size: ${rem(10)};
  line-height: ${rem(12)};
  font-weight: 500;
`;

export const FeatureIcon = styled.span`
  display: inline-flex;
  font-size: ${rem(18)};
  padding: ${rem(3)};
  background-color: ${colors.white["10"]};
  color: ${colors.white["100"]};
  border-radius: 50%;
`;
