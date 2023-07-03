import { matchPath, useLocation } from "react-router-dom";

export const useMatchedPath = (valueToPaths: Record<string, string>) => {
  const location = useLocation();
  const { pathname } = location;

  const matchedValues = Object.entries(valueToPaths)
    .filter(([, path]) => matchPath({ path, end: false }, pathname))
    .map(([value]) => value);

  return matchedValues[0];
};
