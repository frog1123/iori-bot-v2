export const isNumber = (value: string, isPositive: boolean = false) => {
  if (!isPositive) return /^-?\d+$/.test(value);
  return /^\d+$/.test(value);
};
