import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="brand">Inventory</div>

      <nav className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/buyers">Buyers</NavLink>
        <NavLink to="/company-profile">Company Profile</NavLink>
      </nav>
    </aside>
  );
}