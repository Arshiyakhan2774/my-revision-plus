import { useState, useRef, useEffect } from "react";

const SearchableDropdown = ({ label, options, value, onChange, placeholder = "Select..." }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setSearch(options.find(opt => opt.value === val)?.label || "");
    setIsOpen(false);
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!value) setSearch("");
  }, [value]);

  return (
    <div ref={dropdownRef} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onClick={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {isOpen && (
        <ul className="absolute z-10 bg-white border w-full mt-1 max-h-60 overflow-y-auto shadow-lg rounded-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
