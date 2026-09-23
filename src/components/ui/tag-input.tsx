"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

import { parseDelimitedValues } from "../../lib/delimited";

export { parseDelimitedValues };

export interface TagInputProps {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  className?: string;
  id?: string;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ label, placeholder, value = [], onChange, error, className, id }, ref) => {
    const [inputValue, setInputValue] = React.useState("");
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const commitValue = React.useCallback(
      (raw: string) => {
        const unique = parseDelimitedValues(raw, value);
        if (unique.length > 0) {
          onChange([...value, ...unique]);
        }
        setInputValue("");
      },
      [value, onChange],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        if (inputValue.trim()) {
          commitValue(inputValue);
        }
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        value.length > 0
      ) {
        e.preventDefault();
        onChange(value.slice(0, -1));
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      // If input contains a comma or newline (e.g. mobile keyboard, paste, or bulk input), commit tokens
      if (/[,\r\n]/.test(raw)) {
        commitValue(raw);
      } else {
        setInputValue(raw);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData("text");
      if (/[,\r\n]/.test(pasted)) {
        e.preventDefault();
        const combined = inputValue ? `${inputValue},${pasted}` : pasted;
        commitValue(combined);
      }
    };

    const removeTag = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    const editTag = (index: number) => {
      const target = value[index];
      if (!target) return;
      const remaining = value.filter((_, i) => i !== index);
      onChange(remaining);
      setInputValue(target);
      if (inputRef && "current" in inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleContainerClick = () => {
      if (inputRef && "current" in inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div
          onClick={handleContainerClick}
          className={cn(
            "flex flex-wrap items-center gap-1.5 min-h-[40px] w-full rounded-md border border-input bg-white px-2 py-1.5 text-sm transition-all cursor-text",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent",
            error && "border-destructive focus-within:ring-destructive",
            className,
          )}
        >
          {value.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              onDoubleClick={(e) => {
                e.stopPropagation();
                editTag(index);
              }}
              title="Double-click to edit"
              className="inline-flex items-center gap-1 rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium select-none"
            >
              <span>{tag}</span>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="inline-flex items-center justify-center rounded-full h-3.5 w-3.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground text-sm py-0.5"
            placeholder={value.length === 0 ? placeholder : "Add more..."}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => {
              if (inputValue.trim()) {
                commitValue(inputValue);
              }
            }}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
TagInput.displayName = "TagInput";
