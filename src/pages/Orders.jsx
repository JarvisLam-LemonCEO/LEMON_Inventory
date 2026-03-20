import { useEffect, useMemo, useState } from "react";
import OrderForm from "../components/OrderForm";
import OrderEditModal from "../components/OrderEditModal";
import SectionCard from "../components/SectionCard";
import {
  readBuyers,
  readCompany,
  readOrders,
  readProducts,
  saveOrders,
  seedIfEmpty,
} from "../data/storage";
import { exportInvoicePdf } from "../utils/invoice";
import {
  currency,
  formatDate,
  getMonth,
  getYear,
  todayString,
} from "../utils/format";

export default function Orders() {
  const [buyers, setBuyers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [company, setCompany] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    seedIfEmpty();
    setBuyers(readBuyers() || []);
    setProducts(readProducts() || []);
    setOrders(readOrders() || []);
    setCompany(readCompany());
  }, []);

  function reloadOrders() {
    setOrders(readOrders() || []);
  }

  function handleSaveOrder(order) {
    const current = readOrders() || [];
    saveOrders([order, ...current]);
    reloadOrders();
    alert("Order saved.");
  }

  function handleDeleteOrder(orderId) {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    const updated = (readOrders() || []).filter((order) => order.id !== orderId);
    saveOrders(updated);
    reloadOrders();
  }

  function handleUpdateOrder(updatedOrder) {
    const updated = (readOrders() || []).map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    saveOrders(updated);
    reloadOrders();
    setEditingOrder(null);
    alert("Order updated.");
  }

  const years = [...new Set((orders || []).map((o) => getYear(o.orderDate)))];
  const months = [...new Set((orders || []).map((o) => getMonth(o.orderDate)))];

  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      if (filterType === "today") {
        return order.orderDate === todayString();
      }

      if (filterType === "year" && filterYear) {
        return getYear(order.orderDate) === filterYear;
      }

      if (filterType === "month" && filterMonth) {
        return getMonth(order.orderDate) === filterMonth;
      }

      return true;
    });
  }, [orders, filterType, filterYear, filterMonth]);

  function printFilteredInvoices() {
    filteredOrders.forEach((order) => exportInvoicePdf(order, company));
  }

  return (
    <div className="page-grid">
      <SectionCard title="Create Order">
        <OrderForm buyers={buyers} products={products} onSave={handleSaveOrder} />
      </SectionCard>

      <SectionCard
        title="Orders List"
        right={
          <div className="toolbar">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Orders</option>
              <option value="today">Today's Orders</option>
              <option value="month">By Month</option>
              <option value="year">By Year</option>
            </select>

            {filterType === "month" && (
              <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                <option value="">Choose Month</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}

            {filterType === "year" && (
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="">Choose Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}

            <button type="button" onClick={printFilteredInvoices}>
              Print Filtered Invoices
            </button>
          </div>
        }
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Buyer</th>
                <th>Company</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Total Amount</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.invoiceNumber}</td>
                    <td>{order.buyer?.name || ""}</td>
                    <td>{order.buyer?.companyName || ""}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    <td>{currency(order.totalAmount)}</td>
                    <td>{Array.isArray(order.items) ? order.items.length : 0}</td>
                    <td className="action-row">
                      <button
                        type="button"
                        onClick={() => setEditingOrder(order)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => exportInvoicePdf(order, company)}
                      >
                        Export Invoice PDF
                      </button>

                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Delete Order
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <OrderEditModal
        open={!!editingOrder}
        order={editingOrder}
        buyers={buyers}
        products={products}
        onClose={() => setEditingOrder(null)}
        onSave={handleUpdateOrder}
      />
    </div>
  );
}