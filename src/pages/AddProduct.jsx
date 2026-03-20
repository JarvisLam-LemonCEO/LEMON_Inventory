import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    number: "",
    qty: "",
    price: ""
  });

  const handleSubmit = () => {
    const old = JSON.parse(localStorage.getItem("products")) || [];
    localStorage.setItem("products", JSON.stringify([...old, form]));
    nav("/products");
  };

  return (
    <div className="page">
      <h1>Add Product</h1>

      <input placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Number"
        onChange={e => setForm({ ...form, number: e.target.value })} />

      <input placeholder="Quantity"
        onChange={e => setForm({ ...form, qty: e.target.value })} />

      <input placeholder="Price"
        onChange={e => setForm({ ...form, price: e.target.value })} />

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}