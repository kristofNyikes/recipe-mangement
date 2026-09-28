export const tagCapitalize = (tag: string): string => {
  const splitTag = tag
    .split("_")
    .map(
      (tagItem) =>
        tagItem.charAt(0).toUpperCase() + tagItem.slice(1).toLowerCase(),
    );

  return splitTag.join(" ");
};
