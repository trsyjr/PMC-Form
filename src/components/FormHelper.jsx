// src/components/FormHelper.jsx
export const Section = ({ title, children }) => (
  <div>
    <h2 className="mb-6 text-[#2e3192] font-bold text-lg">
      {title}
    </h2>
    <div className="grid md:grid-cols-2 gap-6">{children}</div>
  </div>
);

export const Navigation = ({ onBack, onNext }) => (
  <div className="flex justify-between pt-6">
    <button
      onClick={onBack}
      className="px-8 py-3 rounded-xl border border-[#2e3192] text-[#2e3192] hover:bg-[#2e3192] hover:text-white transition"
    >
      Back
    </button>
    <button
      onClick={onNext}
      className="px-10 py-3 bg-[#2e3192] text-white rounded-xl hover:bg-[#1f2170] transition"
    >
      Next
    </button>
  </div>
);
