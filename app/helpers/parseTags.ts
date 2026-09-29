import { Tag, tags } from "../types";

export const parseTags = (values?: string | string[]): Tag[] => {
  if (!values) return [];

  const tagsToParse = Array.isArray(values) ? values : values.split(",");

  return tagsToParse.filter((tag): tag is Tag => tags.includes(tag as Tag));
};
