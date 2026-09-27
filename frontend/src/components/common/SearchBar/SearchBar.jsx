import { useEffect, useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

import "./SearchBar.css";

function SearchBar({
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  placeholder = "Search stories, writers, genres...",
  loading = false,
  disabled = false,
  autoFocus = false,
  className = "",
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const inputRef = useRef(null);

  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedValue = currentValue.trim();

    if (!trimmedValue || loading || disabled) {
      return;
    }

    onSubmit?.(trimmedValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }

    onChange?.({
      target: {
        value: "",
      },
    });

    inputRef.current?.focus();
  };

  return (
    <form
      className={`lumora-search ${className}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <FaSearch
        className="lumora-search__icon"
        size={17}
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        type="search"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled || loading}
        className="lumora-search__input"
        aria-label="Search Lumora"
      />

      {currentValue && !loading && (
        <button
          type="button"
          className="lumora-search__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <FaTimes size={15} />
        </button>
      )}

      {loading && (
        <span
          className="lumora-search__loader"
          aria-label="Searching"
        />
      )}

      <button
        type="submit"
        className="lumora-search__submit"
        disabled={!currentValue.trim() || loading || disabled}
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;