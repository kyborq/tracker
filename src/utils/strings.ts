export const shortString = (str: string, maxLength: number) => {
  // Check if the string is shorter than the max length
  if (str.length <= maxLength) {
    return str;
  }

  // Calculate the number of characters to keep on each side
  const keepLength = Math.floor((maxLength - 3) / 2);

  // Slice the string and add the ellipsis
  return `${str.slice(0, keepLength)}...${str.slice(-keepLength)}`;
};
