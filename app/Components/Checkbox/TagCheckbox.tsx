"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { parseTags } from "@/app/helpers/parseTags";
import { tagCapitalize } from "@/app/helpers/tagCapitalize";
import { Tag, tags } from "@/app/types";

const TagCheckbox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTags = parseTags(searchParams.get("tags") ?? "");

  const handleTagChange = (tag: Tag, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = parseTags(params.get("tags") ?? "");

    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter((currentTag) => currentTag !== tag);

    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }

    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown relative mt-7">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => setIsOpen((open) => !open)}
      >
        Add tag...
      </button>

      {isOpen && (
        <ul className="menu absolute z-10 mt-1 max-h-96 w-52 flex-nowrap overflow-y-auto rounded-box bg-base-100 p-2 shadow-sm">
          {tags.map((tag) => (
            <li key={tag}>
              <label htmlFor={`tag-${tag}`}>
                <input
                  id={`tag-${tag}`}
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={(event) =>
                    handleTagChange(tag, event.target.checked)
                  }
                  className="checkbox"
                />
                {tagCapitalize(tag)}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagCheckbox;
