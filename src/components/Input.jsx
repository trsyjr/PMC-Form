// src/components/Input.jsx
import React, { useRef, useState, memo } from "react";

const Input = memo(
  ({
    label,
    type = "text",
    name,
    value,
    onChange,
    options = [],
    className = "",
    placeholder = "",
    autoComplete = "off",
  }) => {
    const fileInputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onChange({ target: { files: e.dataTransfer.files } });
      }
    };

    const handleClick = () => fileInputRef.current?.click();

    return (
      <div className={`mb-4 w-full ${className}`}>
        {label && type !== "checkbox" && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}

        {(type === "text" || type === "email" || type === "tel") && (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFE066] ${className}`}
          />
        )}

        {type === "select" && (
          <select
            name={name}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={`w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE066] ${className}`}
          >
            <option value="">Select option</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {type === "checkbox" && (
          <label className="flex items-start gap-3 cursor-pointer w-full">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              className="mt-1 w-5 h-5 accent-[#2e3192]"
            />
            <span className="text-sm text-slate-700 leading-relaxed">{label}</span>
          </label>
        )}

        {type === "file" && (
          <div className="w-full">
            <div
              onClick={handleClick}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition 
                ${isDragOver ? "border-blue-500 bg-blue-50" : "border-slate-300"} 
                ${className}`}
            >
              <input
                type="file"
                name={name}
                ref={fileInputRef}
                onChange={onChange}
                className="hidden"
              />
              <p className="text-sm mt-2">
                {value ? value.name : "Click to upload or drag & drop a file"}
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default Input;
