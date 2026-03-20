import { useMemo, useState } from "react";
import { todayString } from "../utils/format";

export default function OrderForm({ buyers, products, onSave }) {
  const emptyBuyer = {
    buyerId: "",
    name: "",
    companyName: "",
    phone: "",
    address: "",
    email: "",
    fax: "",
  };

  const emptyItem = {
    productId: "",
    name: "",
    number: "",
    category: "",
    quantity: "",
    price: "",
    discountApplied: false,
    finalPrice: "",
  };

  const [buyerKeyword, setBuyerKeyword] = useState("");
  const [productKeyword, setProductKeyword] = useState("");

  const [selectedBuyer, setSelectedBuyer] = useState(emptyBuyer);
  const [item, setItem] = useState(emptyItem);
  const [items, setItems] = useState([]);

  const [orderDate, setOrderDate] = useState(todayString());
  const [deliveryDate, setDeliveryDate] = useState(todayString());

  const buyerMatches = useMemo(() => {
    const keyword = buyerKeyword.trim().toLowerCase();
    if (!keyword) return [];
    return buyers.filter(
      (b) =>
        b.name.toLowerCase().includes(keyword) ||
        b.buyerId.toLowerCase().includes(keyword)
    );
  }, [buyerKeyword, buyers]);

  const productMatches = useMemo(() => {
    const keyword = productKeyword.trim().toLowerCase();
    if (!keyword) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.number.toLowerCase().includes(keyword)
    );
  }, [productKeyword, products]);

  function chooseBuyer(buyer) {
    setSelectedBuyer({
      buyerId: buyer.buyerId || "",
      name: buyer.name || "",
      companyName: buyer.companyName || "",
      phone: buyer.phone || "",
      address: buyer.address || "",
      email: buyer.email || "",
      fax: buyer.fax || "",
    });
    setBuyerKeyword(`${buyer.name} (${buyer.buyerId})`);
  }

  function chooseProduct(product) {
    const defaultFinalPrice = product.discountEnabled
      ? Number(product.salePrice || 0)
      : Number(product.price || 0);

    setItem({
      productId: product.id || "",
      name: product.name || "",
      number: product.number || "",
      category: product.category || "",
      quantity: "",
      price: product.price ?? "",
      discountApplied: !!product.discountEnabled,
      finalPrice: defaultFinalPrice,
    });

    setProductKeyword(`${product.name} (${product.number})`);
  }

  function updateBuyerField(key, value) {
    setSelectedBuyer((prev) => ({ ...prev, [key]: value }));
  }

  function updateItemField(key, value) {
    setItem((prev) => ({ ...prev, [key]: value }));
  }

  function addItem() {
    if (!item.name.trim()) {
      alert("Please enter or select a product name.");
      return;
    }

    if (!item.number.trim()) {
      alert("Please enter or select a product number.");
      return;
    }

    if (!item.quantity || Number(item.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (item.finalPrice === "" || Number(item.finalPrice) < 0) {
      alert("Please enter a valid final price.");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        ...item,
        lineId: crypto.randomUUID(),
        quantity: Number(item.quantity),
        price: Number(item.price || 0),
        finalPrice: Number(item.finalPrice || 0),
      },
    ]);

    setItem(emptyItem);
    setProductKeyword("");
  }

  function removeItem(lineId) {
    setItems((prev) => prev.filter((x) => x.lineId !== lineId));
  }

  const totalAmount = items.reduce(
    (sum, x) => sum + Number(x.quantity) * Number(x.finalPrice),
    0
  );

  function handleSave(e) {
    e.preventDefault();

    if (!selectedBuyer.name.trim()) {
      alert("Please enter buyer name.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one order item.");
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now()}`,
      buyer: {
        ...selectedBuyer,
      },
      items,
      totalAmount,
      orderDate,
      deliveryDate,
      createdAt: new Date().toISOString(),
    });

    setBuyerKeyword("");
    setProductKeyword("");
    setSelectedBuyer(emptyBuyer);
    setItem(emptyItem);
    setItems([]);
    setOrderDate(todayString());
    setDeliveryDate(todayString());
  }

  return (
    <form className="order-layout" onSubmit={handleSave}>
      <div className="card soft-card">
        <h3>Buyer Information</h3>

        <input
          placeholder="Type buyer name or buyer ID for autofill"
          value={buyerKeyword}
          onChange={(e) => setBuyerKeyword(e.target.value)}
        />

        {buyerMatches.length > 0 && (
          <div className="suggestion-box">
            {buyerMatches.map((buyer) => (
              <button
                type="button"
                key={buyer.id}
                className="suggestion-item"
                onClick={() => chooseBuyer(buyer)}
              >
                {buyer.name} - {buyer.buyerId}
              </button>
            ))}
          </div>
        )}

        <div className="buyer-grid">
          <input
            value={selectedBuyer.name}
            placeholder="Name"
            onChange={(e) => updateBuyerField("name", e.target.value)}
          />
          <input
            value={selectedBuyer.companyName}
            placeholder="Company Name"
            onChange={(e) => updateBuyerField("companyName", e.target.value)}
          />
          <input
            value={selectedBuyer.phone}
            placeholder="Phone Number"
            onChange={(e) => updateBuyerField("phone", e.target.value)}
          />
          <input
            value={selectedBuyer.address}
            placeholder="Address"
            onChange={(e) => updateBuyerField("address", e.target.value)}
          />
          <input
            value={selectedBuyer.email}
            placeholder="Email"
            onChange={(e) => updateBuyerField("email", e.target.value)}
          />
          <input
            value={selectedBuyer.fax}
            placeholder="Fax Number"
            onChange={(e) => updateBuyerField("fax", e.target.value)}
          />
          <input
            value={selectedBuyer.buyerId}
            placeholder="Buyer ID Number"
            onChange={(e) => updateBuyerField("buyerId", e.target.value)}
          />
        </div>
      </div>

      <div className="card soft-card">
        <h3>Order Item</h3>

        <input
          placeholder="Type product name or product number for autofill"
          value={productKeyword}
          onChange={(e) => setProductKeyword(e.target.value)}
        />

        {productMatches.length > 0 && (
          <div className="suggestion-box">
            {productMatches.map((product) => (
              <button
                type="button"
                key={product.id}
                className="suggestion-item"
                onClick={() => chooseProduct(product)}
              >
                {product.name} - {product.number}
              </button>
            ))}
          </div>
        )}

        <div className="grid-form">
          <input
            value={item.name}
            placeholder="Product Name"
            onChange={(e) => updateItemField("name", e.target.value)}
          />
          <input
            value={item.number}
            placeholder="Product Number"
            onChange={(e) => updateItemField("number", e.target.value)}
          />
          <input
            value={item.category}
            placeholder="Category"
            onChange={(e) => updateItemField("category", e.target.value)}
          />
          <input
            type="number"
            min="1"
            value={item.quantity}
            placeholder="Quantity"
            onChange={(e) => updateItemField("quantity", e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            value={item.price}
            placeholder="Price"
            onChange={(e) => updateItemField("price", e.target.value)}
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={item.discountApplied}
              onChange={(e) => {
                const checked = e.target.checked;
                let newFinalPrice = item.finalPrice;

                if (item.productId) {
                  const matched = products.find((p) => p.id === item.productId);
                  if (matched) {
                    newFinalPrice = checked
                      ? Number(matched.salePrice || matched.price || 0)
                      : Number(matched.price || 0);
                  }
                }

                setItem((prev) => ({
                  ...prev,
                  discountApplied: checked,
                  finalPrice: newFinalPrice,
                }));
              }}
            />
            Discount Applied
          </label>

          <input
            type="number"
            step="0.01"
            value={item.finalPrice}
            placeholder="Final Price"
            onChange={(e) => updateItemField("finalPrice", e.target.value)}
          />
        </div>

        <button type="button" onClick={addItem}>
          Add Item
        </button>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>No</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Line Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8">No items added yet.</td>
                </tr>
              ) : (
                items.map((x) => (
                  <tr key={x.lineId}>
                    <td>{x.name}</td>
                    <td>{x.number}</td>
                    <td>{x.category}</td>
                    <td>{x.quantity}</td>
                    <td>{x.finalPrice}</td>
                    <td>{x.discountApplied ? "Yes" : "No"}</td>
                    <td>
                      {(Number(x.quantity) * Number(x.finalPrice)).toFixed(2)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() => removeItem(x.lineId)}
                      >
                        Delete Item
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card soft-card">
        <h3>Invoice Information</h3>
        <div className="grid-form">
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
          <input
            value={totalAmount.toFixed(2)}
            readOnly
            placeholder="Total Amount"
          />
        </div>

        <div className="form-actions">
          <button type="submit">Save Order</button>
        </div>
      </div>
    </form>
  );
}