import { useEffect, useMemo, useState } from "react";

export default function OrderEditModal({
  open,
  order,
  buyers,
  products,
  onClose,
  onSave,
}) {
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
  const [buyer, setBuyer] = useState(emptyBuyer);
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    if (!open || !order) return;

    setBuyer({
      buyerId: order?.buyer?.buyerId || "",
      name: order?.buyer?.name || "",
      companyName: order?.buyer?.companyName || "",
      phone: order?.buyer?.phone || "",
      address: order?.buyer?.address || "",
      email: order?.buyer?.email || "",
      fax: order?.buyer?.fax || "",
    });

    setItems(
      Array.isArray(order?.items)
        ? order.items.map((item) => ({
            lineId: item?.lineId || crypto.randomUUID(),
            productId: item?.productId || "",
            name: item?.name || "",
            number: item?.number || "",
            category: item?.category || "",
            quantity: Number(item?.quantity || 0),
            price: Number(item?.price || 0),
            discountApplied: !!item?.discountApplied,
            finalPrice: Number(item?.finalPrice || 0),
          }))
        : []
    );

    setOrderDate(order?.orderDate || "");
    setDeliveryDate(order?.deliveryDate || "");
    setBuyerKeyword("");
    setProductKeyword("");
    setItemForm(emptyItem);
  }, [open, order]);

  const buyerMatches = useMemo(() => {
    const keyword = buyerKeyword.trim().toLowerCase();
    if (!keyword) return [];
    return buyers.filter(
      (b) =>
        (b.name || "").toLowerCase().includes(keyword) ||
        (b.buyerId || "").toLowerCase().includes(keyword)
    );
  }, [buyerKeyword, buyers]);

  const productMatches = useMemo(() => {
    const keyword = productKeyword.trim().toLowerCase();
    if (!keyword) return [];
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(keyword) ||
        (p.number || "").toLowerCase().includes(keyword)
    );
  }, [productKeyword, products]);

  if (!open || !order) return null;

  function chooseBuyer(selected) {
    setBuyer({
      buyerId: selected.buyerId || "",
      name: selected.name || "",
      companyName: selected.companyName || "",
      phone: selected.phone || "",
      address: selected.address || "",
      email: selected.email || "",
      fax: selected.fax || "",
    });
    setBuyerKeyword(`${selected.name} (${selected.buyerId})`);
  }

  function chooseProduct(product) {
    const defaultFinalPrice = product.discountEnabled
      ? Number(product.salePrice || 0)
      : Number(product.price || 0);

    setItemForm({
      productId: product.id || "",
      name: product.name || "",
      number: product.number || "",
      category: product.category || "",
      quantity: "",
      price: Number(product.price || 0),
      discountApplied: !!product.discountEnabled,
      finalPrice: defaultFinalPrice,
    });

    setProductKeyword(`${product.name} (${product.number})`);
  }

  function updateBuyerField(key, value) {
    setBuyer((prev) => ({ ...prev, [key]: value }));
  }

  function updateItemFormField(key, value) {
    setItemForm((prev) => ({ ...prev, [key]: value }));
  }

  function addItem() {
    if (!itemForm.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!itemForm.number.trim()) {
      alert("Please enter product number.");
      return;
    }

    if (!itemForm.quantity || Number(itemForm.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (itemForm.finalPrice === "" || Number(itemForm.finalPrice) < 0) {
      alert("Please enter a valid final price.");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        ...itemForm,
        lineId: crypto.randomUUID(),
        quantity: Number(itemForm.quantity),
        price: Number(itemForm.price || 0),
        finalPrice: Number(itemForm.finalPrice || 0),
      },
    ]);

    setItemForm(emptyItem);
    setProductKeyword("");
  }

  function deleteItem(lineId) {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }

  function updateExistingItem(lineId, key, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.lineId === lineId ? { ...item, [key]: value } : item
      )
    );
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.finalPrice || 0),
    0
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!buyer.name.trim()) {
      alert("Please enter buyer name.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    onSave({
      ...order,
      buyer,
      items: items.map((item) => ({
        ...item,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        finalPrice: Number(item.finalPrice || 0),
      })),
      totalAmount,
      orderDate,
      deliveryDate,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel order-edit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-head modal-header">
          <h2>Edit Order</h2>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="order-edit-layout" onSubmit={handleSubmit}>
          <section className="card">
            <h3>Buyer Info</h3>

            <div className="search-block">
              <label className="field-label">Search Buyer</label>
              <input
                placeholder="Type buyer name or buyer ID"
                value={buyerKeyword}
                onChange={(e) => setBuyerKeyword(e.target.value)}
              />

              {buyerMatches.length > 0 && (
                <div className="suggestion-list">
                  {buyerMatches.map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      className="suggestion-card"
                      onClick={() => chooseBuyer(b)}
                    >
                      <strong>{b.name}</strong>
                      <span>{b.buyerId}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  value={buyer.name}
                  onChange={(e) => updateBuyerField("name", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  value={buyer.companyName}
                  onChange={(e) => updateBuyerField("companyName", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  value={buyer.phone}
                  onChange={(e) => updateBuyerField("phone", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Buyer ID</label>
                <input
                  value={buyer.buyerId}
                  onChange={(e) => updateBuyerField("buyerId", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  value={buyer.email}
                  onChange={(e) => updateBuyerField("email", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Fax</label>
                <input
                  value={buyer.fax}
                  onChange={(e) => updateBuyerField("fax", e.target.value)}
                />
              </div>

              <div className="form-group form-group-full">
                <label>Address</label>
                <input
                  value={buyer.address}
                  onChange={(e) => updateBuyerField("address", e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="card">
            <h3>Add Product</h3>

            <div className="search-block">
              <label className="field-label">Search Product</label>
              <input
                placeholder="Type product name or product number"
                value={productKeyword}
                onChange={(e) => setProductKeyword(e.target.value)}
              />

              {productMatches.length > 0 && (
                <div className="suggestion-list">
                  {productMatches.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      className="suggestion-card"
                      onClick={() => chooseProduct(product)}
                    >
                      <strong>{product.name}</strong>
                      <span>{product.number}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  value={itemForm.name}
                  onChange={(e) => updateItemFormField("name", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Product Number</label>
                <input
                  value={itemForm.number}
                  onChange={(e) => updateItemFormField("number", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  value={itemForm.category}
                  onChange={(e) => updateItemFormField("category", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={itemForm.quantity}
                  onChange={(e) => updateItemFormField("quantity", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) => updateItemFormField("price", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Final Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemForm.finalPrice}
                  onChange={(e) => updateItemFormField("finalPrice", e.target.value)}
                />
              </div>

              <div className="form-group form-group-full">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={itemForm.discountApplied}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      let newFinalPrice = itemForm.finalPrice;

                      if (itemForm.productId) {
                        const matched = products.find(
                          (p) => p.id === itemForm.productId
                        );
                        if (matched) {
                          newFinalPrice = checked
                            ? Number(matched.salePrice || matched.price || 0)
                            : Number(matched.price || 0);
                        }
                      }

                      setItemForm((prev) => ({
                        ...prev,
                        discountApplied: checked,
                        finalPrice: newFinalPrice,
                      }));
                    }}
                  />
                  <span>Discount Applied</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={addItem}>
                Add Item
              </button>
            </div>
          </section>

          <section className="card">
            <h3>Order Items</h3>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>No</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Final Price</th>
                    <th>Discount</th>
                    <th>Line Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="8">No items.</td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.lineId}>
                        <td>
                          <input
                            value={item.name}
                            onChange={(e) =>
                              updateExistingItem(item.lineId, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={item.number}
                            onChange={(e) =>
                              updateExistingItem(item.lineId, "number", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={item.category}
                            onChange={(e) =>
                              updateExistingItem(item.lineId, "category", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateExistingItem(item.lineId, "quantity", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={item.finalPrice}
                            onChange={(e) =>
                              updateExistingItem(item.lineId, "finalPrice", e.target.value)
                            }
                          />
                        </td>
                        <td>{item.discountApplied ? "Yes" : "No"}</td>
                        <td>
                          {(
                            Number(item.quantity || 0) * Number(item.finalPrice || 0)
                          ).toFixed(2)}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="danger-btn"
                            onClick={() => deleteItem(item.lineId)}
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
          </section>

          <section className="card">
            <h3>Invoice Information</h3>

            <div className="grid-form">
              <div className="form-group">
                <label>Order Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Total Amount</label>
                <input value={totalAmount.toFixed(2)} readOnly />
              </div>

              <div className="form-group">
                <label>Invoice Number</label>
                <input value={order.invoiceNumber || ""} readOnly />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" className="ghost-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}