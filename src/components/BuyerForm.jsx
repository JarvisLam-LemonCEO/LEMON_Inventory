import { useEffect, useState } from "react";

const initialState = {
  id: "",
  buyerId: "",
  name: "",
  companyName: "",
  phone: "",
  address: "",
  email: "",
  fax: "",
};

export default function BuyerForm({ initialValue, onSave, onCancel }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialValue) {
      setForm({
        id: initialValue.id || "",
        buyerId: initialValue.buyerId || "",
        name: initialValue.name || "",
        companyName: initialValue.companyName || "",
        phone: initialValue.phone || "",
        address: initialValue.address || "",
        email: initialValue.email || "",
        fax: initialValue.fax || "",
      });
    } else {
      setForm(initialState);
    }
  }, [initialValue]);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.buyerId.trim()) {
      alert("Please enter buyer ID.");
      return;
    }

    if (!form.name.trim()) {
      alert("Please enter buyer name.");
      return;
    }

    onSave({
      ...form,
      id: form.id || crypto.randomUUID(),
    });
  }

  return (
    <form className="grid-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Buyer ID</label>
        <input
          value={form.buyerId}
          onChange={(e) => handleChange("buyerId", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Company Name</label>
        <input
          value={form.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Fax</label>
        <input
          value={form.fax}
          onChange={(e) => handleChange("fax", e.target.value)}
        />
      </div>

      <div className="form-actions form-group-full">
        <button type="submit">Save Buyer</button>
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}