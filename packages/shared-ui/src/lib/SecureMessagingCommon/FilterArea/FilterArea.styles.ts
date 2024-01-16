import styled from "styled-components";

export const FilterArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  border-bottom: 1px solid gray;
  & div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
