import { nanoid } from "nanoid";
import slugify from "slugify";

const generateSLug = (title: string) => {
  return `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
};

export default generateSLug;
