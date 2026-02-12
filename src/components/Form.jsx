// src/components/Form.jsx
import React, { useState } from "react";
import Input from "./Input"; // Your existing Input component
import Navbar from "./Navbar"; // Your navbar if needed

const Form = () => {
  const [step, setStep] = useState(0);
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

  const totalSteps = 3;

  const validateStep = () => {
    if (step === 0) return privacyAccepted;
    if (step === 1)
      return fullName && email && contactNumber && requestType.length && agencyName && agencyType;
    if (step === 2)
      return region && province && lgu && addressee && position && address && letterFile;
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (letterFile) {
        const arrayBuffer = await letterFile.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        formData.letterFileBase64 = base64;
        formData.letterFileName = letterFile.name;
        formData.letterFileType = letterFile.type || "application/octet-stream";
      }

      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.error || "Unknown error");

      alert(`Form submitted successfully! Ticket ID: ${result.id}`);
      
      // Reset form
      setStep(0);
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

    } catch (err) {
      console.error(err);
      alert("Error submitting form: " + err.message);
    }

    setIsSubmitting(false);
  };

  return (
    <form className="max-w-4xl mx-auto p-6" onSubmit={handleSubmit}>
      {/* STEP 0: Privacy */}
      {step === 0 && (
        <>
          <h2>Data Privacy Consent</h2>
          <Input
            type="checkbox"
            label="I consent to data collection"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
          />
          <button type="button" onClick={handleNext} disabled={!privacyAccepted}>Next</button>
        </>
      )}

      {/* STEP 1: Personal Info */}
      {step === 1 && (
        <>
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          <div>
            <label>Request Type</label>
            {["Inclusion", "Localized"].map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={requestType.includes(option)}
                  onChange={(e) =>
                    e.target.checked
                      ? setRequestType([...requestType, option])
                      : setRequestType(requestType.filter((i) => i !== option))
                  }
                />
                {option}
              </label>
            ))}
          </div>
          <Input label="Agency Name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
          <Input label="Agency Type" value={agencyType} onChange={(e) => setAgencyType(e.target.value)} />
          <button type="button" onClick={handleBack}>Back</button>
          <button type="button" onClick={handleNext}>Next</button>
        </>
      )}

      {/* STEP 2: Location + Letter */}
      {step === 2 && (
        <>
          <Input label="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
          <Input label="Province" value={province} onChange={(e) => setProvince(e.target.value)} />
          <Input label="LGU" value={lgu} onChange={(e) => setLgu(e.target.value)} />
          <Input label="Addressee" value={addressee} onChange={(e) => setAddressee(e.target.value)} />
          <Input label="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input type="file" label="Attach Letter" onChange={(e) => setLetterFile(e.target.files[0])} />
          <button type="button" onClick={handleBack}>Back</button>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Submit"}</button>
        </>
      )}
    </form>
  );
};

export default Form;
