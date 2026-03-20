import { useEffect, useState } from "react";

const initialState = {
  id: "",
  name: "",
  number: "",
  category: "",
  quantity: "",
  inStock: "",
  defected: "",
  price: "",
  salePrice: "",
  discountEnabled: false,
};

export default function ProductForm({ initialValue, onSave, onCancel }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialValue) {
      setForm({
        id: initialValue.id || "",
        name: initialValue.name || "",
        number: initialValue.number || "",
        category: initialValue.category || "",
        quantity: initialValue.quantity ?? "",
        inStock: initialValue.inStock ?? "",
        defected: initialValue.defected ?? "",
        price: initialValue.price ?? "",
        salePrice: initialValue.salePrice ?? "",
        discountEnabled: !!initialValue.discountEnabled,
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

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.number.trim()) {
      alert("Please enter product number.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please enter category.");
      return;
    }

    onSave({
      ...form,
      id: form.id || crypto.randomUUID(),
      quantity: Number(form.quantity || 0),
      inStock: Number(form.inStock || 0),
      defected: Number(form.defected || 0),
      price: Number(form.price || 0),
      salePrice: Number(form.salePrice || 0),
      discountEnabled: !!form.discountEnabled,
    });
  }

  return (
    <form className="grid-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product Name</label>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Product Number</label>
        <input
          value={form.number}
          onChange={(e) => handleChange("number", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          min="0"
          value={form.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>In Stock</label>
        <input
          type="number"
          min="0"
          value={form.inStock}
          onChange={(e) => handleChange("inStock", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Defected</label>
        <input
          type="number"
          min="0"
          value={form.defected}
          onChange={(e) => handleChange("defected", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Sale Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.salePrice}
          onChange={(e) => handleChange("salePrice", e.target.value)}
        />
      </div>

      <div className="form-group form-group-full">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.discountEnabled}
            onChange={(e) => handleChange("discountEnabled", e.target.checked)}
          />
          <span>Enable Discount</span>
        </label>
      </div>

      <div className="form-actions form-group-full">
        <button type="submit">Save Product</button>
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}