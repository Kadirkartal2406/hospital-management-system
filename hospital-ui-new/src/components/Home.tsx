import { useEffect, useState } from "react";
import api from "../api";
import { Hasta } from "../types";

const Home = () => {
  const [hastalar, setHastalar] = useState<Hasta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHastalar();
  }, []);

  const fetchHastalar = () => {
    api.get("/hasta")
      .then((res) => setHastalar(res.data))
      .catch((err) => console.error(err));
  };

  // Arama Filtresi
  const filteredHastalar = hastalar.filter(h =>
    h.adSoyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.hastalik && h.hastalik.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* 1. BAŞLIK VE ARAMA */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
          <div>
            <h2 style={{ color: "#2c3e50", margin: 0 }}>👥 Tüm Hastalar Listesi</h2>
            <p style={{color: "#7f8c8d", margin: "5px 0 0 0"}}>Sistemdeki kayıtlı tüm hastalar (Salt Okunur)</p>
          </div>

          <input
            type="text"
            placeholder="🔍 Hasta Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "12px", width: "300px", borderRadius: "25px", border: "1px solid #ccc", outline: "none", color: "#000" }}
          />
      </div>

      {/* 2. TABLO */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#34495e", color: "white", textAlign: "left" }}>
            <th style={{ padding: "15px" }}>ID</th>
            <th style={{ padding: "15px" }}>Ad Soyad</th>
            <th style={{ padding: "15px" }}>Doğum Tarihi</th>
            <th style={{ padding: "15px" }}>Hastalık / Durum</th>
            <th style={{ padding: "15px" }}>Durum</th>
          </tr>
        </thead>
        <tbody>
          {filteredHastalar.map((h) => (
            <tr key={h.hastaID} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "15px", color: "#000" }}>#{h.hastaID}</td>
              <td style={{ padding: "15px", fontWeight: "bold", color: "#000" }}>{h.adSoyad}</td>
              <td style={{ padding: "15px", color: "#000" }}>{h.dogumTarihi}</td>
              <td style={{ padding: "15px" }}>
                  <span style={{background: "#fff3cd", color: "#000", padding: "5px 10px", borderRadius: "15px", fontSize: "0.85rem", fontWeight: "bold"}}>
                    {h.hastalik || "Belirtilmedi"}
                  </span>
              </td>
              <td style={{ padding: "15px" }}>
                  <span style={{color: "#7f8c8d", fontStyle: "italic", fontSize: "0.9rem"}}>Görüntüleme Modu</span>
              </td>
            </tr>
          ))}
          {filteredHastalar.length === 0 && (
              <tr><td colSpan={5} style={{textAlign: "center", padding: "30px", color: "#999"}}>Hasta bulunamadı.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;