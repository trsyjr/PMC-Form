// src/components/Input.jsx
const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  required = false,
  options = [],
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* TEXT / EMAIL */}
      {type !== "select" && type !== "file" && type !== "checkbox" && (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                     focus:outline-none focus:ring-2 focus:ring-[#FFE066]
"
          {...props}
        />
      )}

      {/* SELECT */}
      {type === "select" && (
        <select
          name={name}
          required={required}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#FFE066]
"
        >
          <option value="">Select option</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* CHECKBOX */}
      {type === "checkbox" && (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            required={required}
            className="mt-1 accent-blue-600"
            {...props} // <- add this line
          />
          <span className="text-sm text-slate-600">{label}</span>
        </label>
      )}

      {/* FILE */}
      {type === "file" && (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6
                        text-center hover:border-blue-500 transition">
          <input
            type="file"
            name={name}
            id={name}
            className="hidden"
            {...props}
          />
          <label htmlFor={name} className="cursor-pointer text-slate-500">
            <p className="font-medium">Click to upload or drag & drop</p>
            <p className="text-xs mt-1">PDF, JPG, PNG (max 10MB)</p>
          </label>
        </div>
      )}
    </div>
  );
};

export default Input;
