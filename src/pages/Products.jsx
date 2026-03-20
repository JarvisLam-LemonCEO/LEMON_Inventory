import { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import SectionCard from "../components/SectionCard";
import { readProducts, saveProducts, seedIfEmpty } from "../data/storage";
import { currency } from "../utils/format";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    loadProducts();
  }, []);

  function loadProducts() {
    setProducts(readProducts());
  }

  function handleSaveProduct(product) {
    const current = readProducts();
    const exists = current.some((x) => x.id === product.id);
    const updated = exists
      ? current.map((x) => (x.id === product.id ? product : x))
      : [product, ...current];

    saveProducts(updated);
    loadProducts();
    setEditing(null);
    setOpenCreate(false);
  }

  function handleDelete(id) {
    const updated = readProducts().filter((x) => x.id !== id);
    saveProducts(updated);
    loadProducts();
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchKeyword =
        p.name.toLowerCase().includes(keyword.toLowerCase()) ||
        p.number.toLowerCase().includes(keyword.toLowerCase());

      const matchCategory = category ? p.category === category : true;
      return matchKeyword && matchCategory;
    });
  }, [products, keyword, category]);

  return (
    <div className="page-grid">
      <SectionCard
        title="Products"
        right={
          <div className="toolbar">
            <input
              placeholder="Search by product name or product number"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
            <button onClick={() => setOpenCreate(true)}>Add Product</button>
          </div>
        }
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>In Stock</th>
                <th>Defected</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.number}</td>
                    <td>{p.category}</td>
                    <td>{p.quantity}</td>
                    <td>{p.inStock}</td>
                    <td>{p.defected}</td>
                    <td>{currency(p.price)}</td>
                    <td>{currency(p.salePrice)}</td>
                    <td>{p.discountEnabled ? "Enabled" : "No"}</td>
                    <td className="action-row">
                      <button onClick={() => setEditing(p)}>Edit</button>
                      <button className="danger-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Modal open={openCreate} title="Add Product" onClose={() => setOpenCreate(false)}>
        <ProductForm onSave={handleSaveProduct} onCancel={() => setOpenCreate(false)} />
      </Modal>

      <Modal open={!!editing} title="Edit Product" onClose={() => setEditing(null)}>
        <ProductForm initialValue={editing} onSave={handleSaveProduct} onCancel={() => setEditing(null)} />
      </Modal>
    </div>
  );
}