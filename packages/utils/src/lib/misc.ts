export const ensureNotNull = <T>(value: T | null | undefined): T => {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
  return value;
};

export const isNumeric = (n: string) => !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
