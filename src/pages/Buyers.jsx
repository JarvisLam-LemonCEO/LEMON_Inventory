import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import BuyerForm from "../components/BuyerForm";
import Modal from "../components/Modal";
import SectionCard from "../components/SectionCard";
import { readBuyers, saveBuyers, seedIfEmpty } from "../data/storage";

export default function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    seedIfEmpty();
    loadBuyers();
  }, []);

  function loadBuyers() {
    setBuyers(readBuyers());
  }

  function saveBuyer(buyer) {
    const current = readBuyers();
    const exists = current.some((x) => x.id === buyer.id);
    const updated = exists
      ? current.map((x) => (x.id === buyer.id ? buyer : x))
      : [buyer, ...current];
    saveBuyers(updated);
    loadBuyers();
    setOpenCreate(false);
    setEditing(null);
  }

  function deleteBuyer(id) {
    const updated = readBuyers().filter((x) => x.id !== id);
    saveBuyers(updated);
    loadBuyers();
  }

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return buyers.filter((b) =>
      [b.name, b.buyerId, b.email, b.phone, b.companyName]
        .join(" ")
        .toLowerCase()
        .includes(k)
    );
  }, [buyers, keyword]);

  function exportBuyerPdf(buyer) {
    const doc = new jsPDF();
    doc.text("Buyer Information", 14, 20);
    doc.text(`Buyer ID: ${buyer.buyerId}`, 14, 35);
    doc.text(`Name: ${buyer.name}`, 14, 45);
    doc.text(`Company Name: ${buyer.companyName}`, 14, 55);
    doc.text(`Phone Number: ${buyer.phone}`, 14, 65);
    doc.text(`Address: ${buyer.address}`, 14, 75);
    doc.text(`Email: ${buyer.email}`, 14, 85);
    doc.text(`Fax Number: ${buyer.fax}`, 14, 95);
    doc.save(`${buyer.buyerId || buyer.name}.pdf`);
  }

  function exportAllBuyersCsv() {
    const headers = ["buyerId", "name", "companyName", "phone", "address", "email", "fax"];
    const rows = buyers.map((b) => headers.map((h) => `"${b[h] || ""}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "buyers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-grid">
      <SectionCard
        title="Buyers"
        right={
          <div className="toolbar">
            <input
              placeholder="Filter by name, ID, email, phone, company"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={() => setOpenCreate(true)}>Add Buyer</button>
            <button className="ghost-btn" onClick={exportAllBuyersCsv}>Export All Buyers</button>
          </div>
        }
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Buyer ID</th>
                <th>Name</th>
                <th>Company Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Fax</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8">No buyers found.</td>
                </tr>
              ) : (
                filtered.map((buyer) => (
                  <tr key={buyer.id}>
                    <td>{buyer.buyerId}</td>
                    <td>{buyer.name}</td>
                    <td>{buyer.companyName}</td>
                    <td>{buyer.phone}</td>
                    <td>{buyer.email}</td>
                    <td>{buyer.fax}</td>
                    <td>{buyer.address}</td>
                    <td className="action-row">
                      <button onClick={() => setEditing(buyer)}>Edit</button>
                      <button onClick={() => exportBuyerPdf(buyer)}>Export</button>
                      <button className="danger-btn" onClick={() => deleteBuyer(buyer.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Modal open={openCreate} title="Add Buyer" onClose={() => setOpenCreate(false)}>
        <BuyerForm onSave={saveBuyer} onCancel={() => setOpenCreate(false)} />
      </Modal>

      <Modal open={!!editing} title="Edit Buyer" onClose={() => setEditing(null)}>
        <BuyerForm initialValue={editing} onSave={saveBuyer} onCancel={() => setEditing(null)} />
      </Modal>
    </div>
  );
}