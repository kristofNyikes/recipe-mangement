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
  const [tagSearch, setTagSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTags = parseTags(searchParams.get("tags") ?? "");

  const filteredTags = tags.filter((tag) =>
    tagCapitalize(tag).toLowerCase().includes(tagSearch.toLowerCase()),
  );

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
        <div className="absolute z-10 mt-1 w-52 rounded-box bg-base-100 p-2 shadow-sm">
          <input
            type="text"
            className="input input-sm w-full"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
          />

          <ul className="menu mt-2 max-h-72 flex-nowrap overflow-y-auto p-0">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
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
              ))
            ) : (
              <li className="pointer-events-none">
                <span className="text-sm opacity-60">No matching tags</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagCheckbox;
