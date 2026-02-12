// src/components/Form.jsx
import React, { useState } from "react";
import Input from "./Input";
import Navbar from "./Navbar";
import { Section, Navigation } from "./FormHelper";
import DABG from "../assets/DABG.png";

const Form = () => {
  const [step, setStep] = useState(0);
  const [submittedStep, setSubmittedStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [requestType, setRequestType] = useState([]);
  const [agencyName, setAgencyName] = useState("");
  const [agencyType, setAgencyType] = useState("");

  // Step 2
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [lgu, setLgu] = useState("");
  const [addressee, setAddressee] = useState("");
  const [position, setPosition] = useState("");
  const [address, setAddress] = useState("");
  const [letterFile, setLetterFile] = useState(null);

  const shakeClass = "shake border-red-500";
  const totalSteps = 3;

  const validateStep = () => {
    if (step === 0) return privacyAccepted;
    if (step === 1)
      return (
        fullName.trim() &&
        email.trim() &&
        contactNumber.trim() &&
        requestType.length > 0 &&
        agencyName.trim() &&
        agencyType.trim()
      );
    if (step === 2)
      return (
        region.trim() &&
        province.trim() &&
        lgu.trim() &&
        addressee.trim() &&
        position.trim() &&
        address.trim() &&
        letterFile
      );
    return true;
  };

  const handleNext = () => {
    setSubmittedStep(step + 1);
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedStep(step + 1);
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const formData = {
        fullName,
        email,
        contactNumber,
        requestType,
        agencyName,
        agencyType,
        region,
        province,
        lgu,
        addressee,
        position,
        address,
      };

      // ---------------- Convert File to Base64 ----------------
      if (letterFile) {
        const arrayBuffer = await letterFile.arrayBuffer();
        formData.letterFileBase64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        formData.letterFileName = letterFile.name;
        formData.letterFileType = letterFile.type || "application/octet-stream";
      }

      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        alert(`Form submitted successfully! Ticket ID: ${result.id || "N/A"}`);

        // Reset all fields
        setStep(0);
        setSubmittedStep(0);
        setPrivacyAccepted(false);
        setFullName("");
        setEmail("");
        setContactNumber("");
        setRequestType([]);
        setAgencyName("");
        setAgencyType("");
        setRegion("");
        setProvince("");
        setLgu("");
        setAddressee("");
        setPosition("");
        setAddress("");
        setLetterFile(null);
      } else {
        alert("Error submitting form: " + (result.error || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Form submission failed. Check console.");
    }

    setIsSubmitting(false);
  };

  // ---------------- RENDER ----------------
  return (
    <>
      <Navbar step={step} totalSteps={totalSteps} privacyAccepted={privacyAccepted} />

      <div className="min-h-screen relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${DABG})` }}
        />
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative min-h-screen flex justify-center pt-[220px] pb-10 px-6">
          <div className="w-full max-w-6xl">
            {/* STEP 0 */}
            {step === 0 && (
              <section className="max-w-2xl mx-auto space-y-6 flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-center text-[#2e3192] font-bold text-2xl">
                  Data Privacy Consent
                </h2>
                <p>
                  By checking the box below, you consent to the collection, use, and
                  processing of your personal data in accordance with the Data Privacy Act.
                </p>
                <p className="mt-2">
                  This information will be used solely for the purposes of processing
                  your request and will not be shared without your consent.
                </p>

                <Input
                  type="checkbox"
                  label="I consent to the collection and processing of my personal data."
                  value={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className={`w-full ${submittedStep >= 1 && !privacyAccepted ? shakeClass : ""}`}
                  name="privacy_consent_unique"
                  autoComplete="off"
                />

                <button
                  disabled={!privacyAccepted}
                  onClick={handleNext}
                  className={`px-10 py-3 rounded-xl font-medium transition ${
                    privacyAccepted
                      ? "bg-[#2e3192] text-white hover:bg-[#1f2170]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </section>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <section className="space-y-10 bg-white p-6 rounded-xl shadow-lg">
                <Section title="PRE-MARRIAGE COUNSELING FORM">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex. Juan R. Dela Cruz"
                    className={submittedStep >= 2 && !fullName ? shakeClass : ""}
                    name="full_name_unique"
                    autoComplete="new-name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex. xxxx@example.com"
                    className={submittedStep >= 2 && !email ? shakeClass : ""}
                    name="email_unique"
                    autoComplete="new-email"
                  />
                  <Input
                    label="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Ex. 09XX-XXXX-XXXXX"
                    className={submittedStep >= 2 && !contactNumber ? shakeClass : ""}
                    name="contact_unique"
                    autoComplete="new-tel"
                  />
                </Section>

                <Section title="Type of Request">
                  <div className={`flex flex-wrap gap-6 ${submittedStep >= 2 && requestType.length === 0 ? shakeClass : ""}`}>
                    {["Inclusion", "Localized"].map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={option}
                          checked={requestType.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setRequestType([...requestType, option]);
                            else
                              setRequestType(requestType.filter((i) => i !== option));
                          }}
                          className="w-4 h-4 accent-[#2e3192]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </Section>

                <Section title="Agency / Organization">
                  <Input
                    label="Name of Agency / Organization"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Ex. DSWD"
                    className={submittedStep >= 2 && !agencyName ? shakeClass : ""}
                    name="agency_name_unique"
                    autoComplete="new-organization"
                  />
                  <Input
                    label="Type of Agency / Organization"
                    type="select"
                    value={agencyType}
                    onChange={(e) => setAgencyType(e.target.value)}
                    options={[
                      { value: "DSWD CO", label: "DSWD CO" },
                      { value: "DSWD FO", label: "DSWD FO" },
                      { value: "LGU-City", label: "LGU-City" },
                      { value: "LGU-Municipality", label: "LGU-Municipality" },
                      { value: "LGU-Province", label: "LGU-Province" },
                      { value: "National Government Agency", label: "National Government Agency" },
                      { value: "Non-Government Organization", label: "Non-Government Organization" },
                      { value: "Religious", label: "Religious" },
                      { value: "Others", label: "Others" },
                    ]}
                    className={submittedStep >= 2 && !agencyType ? shakeClass : ""}
                    name="agency_type_unique"
                    autoComplete="new-official"
                  />
                </Section>

                <Navigation onBack={handleBack} onNext={handleNext} />
              </section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <section className="space-y-10 bg-white p-6 rounded-xl shadow-lg">
                <Section title="Location Information">
                  <Input
                    label="Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Ex. CALABARZON"
                    className={submittedStep >= 3 && !region ? shakeClass : ""}
                    name="region_unique"
                    autoComplete="new-region"
                  />
                  <Input
                    label="Province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Ex. Rizal"
                    className={submittedStep >= 3 && !province ? shakeClass : ""}
                    name="province_unique"
                    autoComplete="new-province"
                  />
                  <Input
                    label="LGU (Specify)"
                    value={lgu}
                    onChange={(e) => setLgu(e.target.value)}
                    placeholder="Ex. City of Antipolo"
                    className={submittedStep >= 3 && !lgu ? shakeClass : ""}
                    name="lgu_unique"
                    autoComplete="new-lgu"
                  />
                </Section>

                <Section title="Letter Information">
                  <Input
                    label="Addressee"
                    value={addressee}
                    onChange={(e) => setAddressee(e.target.value)}
                    placeholder="Ex. Pedro S. Paterno"
                    className={submittedStep >= 3 && !addressee ? shakeClass : ""}
                    name="addressee_unique"
                    autoComplete="new-addressee"
                  />
                  <Input
                    label="Position of Addressee"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Ex. Mayor of Antipolo City"
                    className={submittedStep >= 3 && !position ? shakeClass : ""}
                    name="position_unique"
                    autoComplete="new-position"
                  />
                  <Input
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex. Antipolo City, Rizal"
                    className={submittedStep >= 3 && !address ? shakeClass : ""}
                    name="address_unique"
                    autoComplete="new-address"
                  />

                  <div>
                    <Input
                      type="file"
                      label="Attach Scanned Letter"
                      onChange={(e) => setLetterFile(e.target.files[0])}
                      className={`${submittedStep >= 3 && !letterFile ? shakeClass : ""}`}
                      name="letter_file_unique"
                    />
                    {letterFile && (
                      <div className="mt-2 flex items-center justify-between text-sm text-green-700">
                        <span>Uploaded: {letterFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setLetterFile(null)}
                          className="text-red-600 hover:underline ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </Section>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-xl border border-[#2e3192] text-[#2e3192] hover:bg-[#2e3192] hover:text-white transition"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-10 py-3 bg-[#2e3192] text-white rounded-xl hover:bg-[#1f2170] active:scale-95 transition ${
                      isSubmitting ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
