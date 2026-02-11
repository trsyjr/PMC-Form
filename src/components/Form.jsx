import { useState } from "react";
import Input from "./Input";
import Navbar from "./Navbar";
import { Section, Navigation } from "./FormHelper";
import DABG from "../assets/DABG.png";

const Form = () => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [step, setStep] = useState(0);

  // Dropdown states
  const [requestType, setRequestType] = useState("");
  const [requestTypeOther, setRequestTypeOther] = useState("");

  const [agencyType, setAgencyType] = useState("");
  const [agencyTypeOther, setAgencyTypeOther] = useState("");

  const totalSteps = 3;

  return (
    <>
      <Navbar step={step} totalSteps={totalSteps} />

      <div className="min-h-screen relative">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${DABG})` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative min-h-screen flex justify-center pt-[220px] pb-10 px-6">
          <div className="w-full max-w-6xl">

            {/* STEP 0 – DATA PRIVACY */}
            {step === 0 && (
              <section className="max-w-md mx-auto space-y-6 animate-fadeIn flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-center text-[#2e3192] font-bold text-2xl">
                  Data Privacy Consent
                </h2>

                <Input
                  type="checkbox"
                  label="I consent to the collection and processing of my personal data in accordance with the Data Privacy Act."
                  name="dataPrivacy"
                  required
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                />

                <button
                  disabled={!privacyAccepted}
                  onClick={() => setStep(1)}
                  className={`px-10 py-3 rounded-xl font-medium transition
                    ${
                      privacyAccepted
                        ? "bg-[#2e3192] text-white hover:bg-[#1f2170]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Continue
                </button>
              </section>
            )}

            {/* STEP 1 – PERSONAL + TYPE OF REQUEST + AGENCY */}
            {step === 1 && (
              <section className="space-y-10 animate-slideUp bg-white p-6 rounded-xl shadow-lg">

                <Section title="PRE-MARRIAGE COUNCELING FORM">
                  <Input label="Full Name" name="fullName" required />
                  <Input label="Email Address" type="email" name="email" required />
                  <Input label="Contact Number" name="contactNumber" />
                </Section>

                <Section title="Type of Request">
                  <Input
                    type="select"
                    label="Type of Request"
                    name="requestType"
                    options={[
                      { value: "Inclusion", label: "Inclusion" },
                      { value: "Localized", label: "Localized" },
                      { value: "Accreditation", label: "Accreditation" },
                      { value: "Others", label: "Others" }
                    ]}
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  />
                  {requestType === "Others" && (
                    <Input
                      label="Please specify"
                      name="requestTypeOther"
                      value={requestTypeOther}
                      onChange={(e) => setRequestTypeOther(e.target.value)}
                    />
                  )}

                  <Input
                    type="select"
                    label="Accreditation Status"
                    name="accreditationStatus"
                    options={[
                      { value: "For Accreditation", label: "For Accreditation" },
                      { value: "For Renewal", label: "For Renewal" },
                      { value: "Not Applicable", label: "Not Applicable" }
                    ]}
                  />
                </Section>

                <Section title="Agency / Organization">
                  <Input label="Name of Agency / Organization" name="agencyName" />
                  <Input
                    type="select"
                    label="Type of Agency / Organization"
                    name="agencyType"
                    options={[
                      { value: "DSWD CO", label: "DSWD CO" },
                      { value: "DSWD FO", label: "DSWD FO" },
                      { value: "LGU-City", label: "LGU-City" },
                      { value: "LGU-Municipality", label: "LGU-Municipality" },
                      { value: "LGU-Province", label: "LGU-Province" },
                      { value: "National Government Agency", label: "National Government Agency" },
                      { value: "Non-Government Organization", label: "Non-Government Organization" },
                      { value: "Religious", label: "Religious" },
                      { value: "Others", label: "Others" }
                    ]}
                    value={agencyType}
                    onChange={(e) => setAgencyType(e.target.value)}
                  />
                  {agencyType === "Others" && (
                    <Input
                      label="Please specify"
                      name="agencyTypeOther"
                      value={agencyTypeOther}
                      onChange={(e) => setAgencyTypeOther(e.target.value)}
                    />
                  )}
                </Section>

                <Navigation
                  onBack={() => setStep(0)}
                  onNext={() => setStep(2)}
                />
              </section>
            )}

            {/* STEP 2 – LOCATION + LETTER */}
            {step === 2 && (
              <section className="space-y-10 animate-slideUp bg-white p-6 rounded-xl shadow-lg">
                <Section title="Location Information">
                  <Input label="Region" name="region" />
                  <Input label="Province" name="province" />
                  <Input label="LGU (Specify)" name="lgu" />
                </Section>

                <Section title="Letter Information">
                  <Input label="Addressee" name="addressee" />
                  <Input label="Position of Addressee" name="position" />
                  <Input label="Address" name="address" />
                  <Input type="file" label="Attach Scanned Letter" name="letterFile" />
                </Section>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-3 rounded-xl border border-[#2e3192] text-[#2e3192] hover:bg-[#2e3192] hover:text-white transition"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="px-10 py-3 bg-[#2e3192] text-white rounded-xl hover:bg-[#1f2170] active:scale-95 transition"
                  >
                    Submit Request
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
