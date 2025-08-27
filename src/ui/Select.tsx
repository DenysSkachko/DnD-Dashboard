import React, { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string };

type SelectProps = {
  value: string;
  options: (string | Option)[]; // теперь можно и строки, и объекты
  onChange: (value: string) => void;
  label?: string;
  className?: string;
};

const Select: React.FC<SelectProps> = ({ value, options, onChange, label, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = (val: string) => {
    const opt = options.find(
      o => (typeof o === "string" ? o === val : o.value === val)
    );
    if (!opt) return val;
    return typeof opt === "string" ? opt : opt.label;
  };

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="absolute -top-2 right-1 bg-accent rounded-md px-3 text-sm font-medium text-light z-30">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full relative bg-dark-hover rounded-md font-bold px-5 py-3 text-xl focus:outline-none focus:border-accent"
      >
        <span>{value ? getLabel(value) : "Select..."}</span>
        <svg
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-dark border border-gray-600 rounded-lg max-h-60 overflow-auto shadow-lg">
          {options.map(opt => {
            const val = typeof opt === "string" ? opt : opt.value;
            const labelText = typeof opt === "string" ? opt : opt.label;
            return (
              <li
                key={val}
                onClick={() => {
                  onChange(val);
                  setIsOpen(false);
                }}
                className="px-4 py-3 cursor-pointer hover:bg-accent-hover transition-colors"
              >
                {labelText}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
