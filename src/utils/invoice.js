import { useEffect, useState } from "react";
import { readCompany, saveCompany } from "../data/storage";
import SectionCard from "../components/SectionCard";

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    name: "",
    phone: "",
    address: "",
    fax: "",
    logo: "",
  });

  useEffect(() => {
    const data = readCompany();
    if (data) setCompany(data);
  }, []);

  function handleChange(key, value) {
    setCompany((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      setCompany((prev) => ({
        ...prev,
        logo: base64,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    saveCompany(company);
    alert("Company saved!");
  }

  return (
    <div className="page-grid">
      <SectionCard title="Company Profile">
        <div className="grid-form">
          <div className="form-group">
            <label>Company Name</label>
            <input
              value={company.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              value={company.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Fax</label>
            <input
              value={company.fax}
              onChange={(e) => handleChange("fax", e.target.value)}
            />
          </div>

          <div className="form-group form-group-full">
            <label>Address</label>
            <input
              value={company.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="form-group form-group-full">
            <label>Company Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          </div>

          {company.logo && (
            <div className="form-group form-group-full">
              <label>Preview</label>
              <img
                src={company.logo}
                alt="logo"
                style={{ width: 120, borderRadius: 8 }}
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button onClick={handleSave}>Save Company</button>
        </div>
      </SectionCard>
    </div>
  );
}