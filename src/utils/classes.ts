type TClass = string | number | boolean | null | undefined;

export const classes = (...args: TClass[]) => {
  return args.filter(Boolean).join(" ");
};
