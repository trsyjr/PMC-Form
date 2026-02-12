// src/components/Input.jsx
import React from "react";

const Input = ({ label, type = "text", name, value, onChange, options = [], className = "", placeholder = "" }) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && type !== "checkbox" && <label className="block mb-1 font-medium">{label}</label>}

      {type === "text" || type === "email" || type === "tel" ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ) : null}

      {type === "select" && (
        <select name={name} value={value} onChange={onChange} className="w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">Select option</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {type === "checkbox" && (
        <label className="flex items-center gap-2">
          <input type="checkbox" name={name} checked={value} onChange={onChange} className="accent-blue-500" />
          <span>{label}</span>
        </label>
      )}

      {type === "file" && (
        <div>
          <input type="file" name={name} onChange={onChange} className="w-full" />
          {value && <p className="mt-1 text-sm text-green-700">Uploaded: {value.name}</p>}
        </div>
      )}
    </div>
  );
};

export default Input;
