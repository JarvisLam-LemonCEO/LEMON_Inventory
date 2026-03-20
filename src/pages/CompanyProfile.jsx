import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { readCompany, saveCompany, seedIfEmpty } from "../data/storage";

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    logo: "",
    name: "",
    phone: "",
    address: "",
    fax: "",
  });

  useEffect(() => {
    seedIfEmpty();
    setCompany(readCompany());
  }, []);

  function updateField(key, value) {
    setCompany((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCompany((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();
    saveCompany(company);
    alert("Company profile saved.");
  }

  return (
    <div className="page-grid">
      <SectionCard title="Company Profile">
        <form className="profile-layout" onSubmit={handleSave}>
          <div className="logo-box">
            {company.logo ? (
              <img src={company.logo} alt="Company Logo" className="logo-preview" />
            ) : (
              <div className="logo-placeholder">Logo Preview</div>
            )}
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          </div>

          <div className="grid-form">
            <input
              placeholder="Company Name"
              value={company.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
            <input
              placeholder="Phone Number"
              value={company.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <input
              placeholder="Address"
              value={company.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
            <input
              placeholder="Fax Number"
              value={company.fax}
              onChange={(e) => updateField("fax", e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit">Save Company Info</button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}