import { useEffect, useMemo, useState } from "react";
import DashboardCharts from "../components/DashboardCharts";
import SectionCard from "../components/SectionCard";
import { readOrders, readProducts, seedIfEmpty } from "../data/storage";
import { currency } from "../utils/format";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    seedIfEmpty();
    setOrders(readOrders());
    setProducts(readProducts());
  }, []);

  const productSalesMap = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = { qty: 0, revenue: 0 };
        }
        map[item.name].qty += Number(item.quantity);
        map[item.name].revenue += Number(item.quantity) * Number(item.finalPrice);
      });
    });
    return map;
  }, [orders]);

  const salesData = Object.entries(productSalesMap)
    .map(([name, value]) => ({ name, sales: value.revenue }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  const pieData = Object.entries(productSalesMap)
    .map(([name, value]) => ({ name, value: value.qty }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const ranking = Object.entries(productSalesMap)
    .map(([name, value]) => ({
      name,
      qty: value.qty,
      revenue: value.revenue,
    }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="page-grid">
      <SectionCard title="Overview">
        <div className="stats-grid">
          <div className="stat-box">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="stat-box">
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
          <div className="stat-box">
            <span>Total Revenue</span>
            <strong>{currency(totalRevenue)}</strong>
          </div>
        </div>
      </SectionCard>

      <DashboardCharts salesData={salesData} pieData={pieData} />

      <SectionCard title="Most Popular Products Ranking">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Sold Qty</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {ranking.length === 0 ? (
                <tr>
                  <td colSpan="4">No order data yet.</td>
                </tr>
              ) : (
                ranking.map((item, index) => (
                  <tr key={item.name}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{currency(item.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}