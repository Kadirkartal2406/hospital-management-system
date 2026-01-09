import { useEffect, useState } from "react";
import api from "../api";
import { Doktor, TibbiBirim } from "../types";
import Swal from "sweetalert2";

const AdminPanel = () => {
  const [birimler, setBirimler] = useState<TibbiBirim[]>([]);
  const [doktorlar, setDoktorlar] = useState<Doktor[]>([]);
  const [yeniBirimAdi, setYeniBirimAdi] = useState("");
  const [yeniDoktorAd, setYeniDoktorAd] = useState("");
  const [yeniDoktorUzmanlik, setYeniDoktorUzmanlik] = useState("");
  const [secilenBirimID, setSecilenBirimID] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const bRes = await api.get("/tibbiBirim");
      if (Array.isArray(bRes.data)) setBirimler(bRes.data);
      const dRes = await api.get("/doktor");
      if (Array.isArray(dRes.data)) setDoktorlar(dRes.data);
    } catch (error) { console.error(error); }
  };

  const handleAddBirim = async () => {
    if (!yeniBirimAdi) return Swal.fire("Uyarı", "Birim adı giriniz", "warning");
    try {
      await api.post("/tibbiBirim", { birimAdi: yeniBirimAdi });
      Swal.fire({ icon: 'success', title: 'Eklendi', showConfirmButton: false, timer: 1000 });
      setYeniBirimAdi(""); fetchData();
    } catch (e) { Swal.fire("Hata", "Ekleme başarısız", "error"); }
  };

  const handleDeleteBirim = async (id: number) => {
    Swal.fire({ title: 'Silinsin mi?', text: "Bu birim ve doktorları silinebilir!", icon: 'warning', showCancelButton: true, confirmButtonText: 'Evet, Sil' }).then(async (result) => {
      if (result.isConfirmed) {
        try { await api.delete(`/tibbiBirim/${id}`); fetchData(); Swal.fire('Silindi', '', 'success'); }
        catch (e) { Swal.fire("Hata", "Silinemedi.", "error"); }
      }
    });
  };

  const handleAddDoktor = async () => {
    if (!yeniDoktorAd || !secilenBirimID || !yeniDoktorUzmanlik) return Swal.fire("Uyarı", "Eksik bilgi girdiniz", "warning");
    try {
      await api.post("/doktor", { adSoyad: yeniDoktorAd, uzmanlik: yeniDoktorUzmanlik, tibbiBirim: { birimID: Number(secilenBirimID) } });
      Swal.fire({ icon: 'success', title: 'Doktor Eklendi', showConfirmButton: false, timer: 1000 });
      setYeniDoktorAd(""); setYeniDoktorUzmanlik(""); fetchData();
    } catch (e) { Swal.fire("Hata", "Ekleme başarısız", "error"); }
  };

  const handleDeleteDoktor = async (id: number) => {
    Swal.fire({ title: 'Silinsin mi?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sil' }).then(async (result) => {
      if (result.isConfirmed) { await api.delete(`/doktor/${id}`); fetchData(); Swal.fire('Silindi', '', 'success'); }
    });
  };

  return (
    <div style={{ padding: "40px", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "30px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
        <h2 style={{ color: "#2c3e50", margin: 0, borderLeft: "5px solid #3498db", paddingLeft: "15px" }}>
            ⚙️ Hastane Kaynak Yönetimi
        </h2>
        <p style={{ margin: "5px 0 0 20px", color: "#7f8c8d" }}>Poliklinik ve Doktor tanımlamalarını buradan yapabilirsiniz.</p>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* --- SOL KART: BİRİMLER --- */}
        <div style={cardStyle}>
          <div style={{ ...headerStyle, borderBottom: "2px solid #e67e22" }}>
            <h3 style={{ margin: 0, color: "#d35400" }}>🏥 Poliklinikler</h3>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input value={yeniBirimAdi} onChange={(e) => setYeniBirimAdi(e.target.value)} placeholder="Yeni Birim Adı..." style={inputStyle} />
            <button onClick={handleAddBirim} style={{...btnStyle, background: "#e67e22"}}>Ekle</button>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={tableStyle}>
                <tbody>
                {birimler.map(b => (
                    <tr key={b.birimID} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontWeight: "600", color: "#2c3e50" }}>{b.birimAdi}</td>
                    <td style={{ textAlign: "right" }}>
                        <button onClick={() => handleDeleteBirim(b.birimID)} style={btnDeleteStyle}>🗑️</button>
                    </td>
                    </tr>
                ))}
                {birimler.length === 0 && <tr><td colSpan={2} style={{textAlign: "center", padding: "15px", color: "#999"}}>Kayıt yok.</td></tr>}
                </tbody>
            </table>
          </div>
        </div>

        {/* --- SAĞ KART: DOKTORLAR --- */}
        <div style={{...cardStyle, flex: 1.5}}>
          <div style={{ ...headerStyle, borderBottom: "2px solid #27ae60" }}>
            <h3 style={{ margin: 0, color: "#219150" }}>👨‍⚕️ Doktorlar</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <input value={yeniDoktorAd} onChange={(e) => setYeniDoktorAd(e.target.value)} placeholder="Doktor Adı" style={inputStyle} />
            <input value={yeniDoktorUzmanlik} onChange={(e) => setYeniDoktorUzmanlik(e.target.value)} placeholder="Uzmanlık Alanı" style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <select value={secilenBirimID} onChange={(e) => setSecilenBirimID(e.target.value)} style={inputStyle}>
              <option value="">-- Birim Seçiniz --</option>
              {birimler.map(b => <option key={b.birimID} value={b.birimID} style={{color: "#000"}}>{b.birimAdi}</option>)}
            </select>
            <button onClick={handleAddDoktor} style={{...btnStyle, background: "#27ae60", width: "120px"}}>Kaydet</button>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={tableStyle}>
                <thead>
                    <tr style={{textAlign: "left", color: "#95a5a6", fontSize: "0.85rem"}}>
                        <th style={{paddingBottom: "10px"}}>Doktor</th>
                        <th style={{paddingBottom: "10px"}}>Birim</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {doktorlar.map(d => (
                    <tr key={d.doktorID} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontWeight: "bold", color: "#2c3e50" }}>{d.adSoyad}</td>
                    <td style={{ padding: "12px" }}>
                        <span style={{background: "#ecf0f1", color: "#2c3e50", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem"}}>
                            {d.tibbiBirim?.birimAdi}
                        </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                        <button onClick={() => handleDeleteDoktor(d.doktorID)} style={btnDeleteStyle}>🗑️</button>
                    </td>
                    </tr>
                ))}
                {doktorlar.length === 0 && <tr><td colSpan={3} style={{textAlign: "center", padding: "15px", color: "#999"}}>Kayıt yok.</td></tr>}
                </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// Styles
const cardStyle: React.CSSProperties = { flex: 1, background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", minWidth: "320px", display: "flex", flexDirection: "column" };
const headerStyle: React.CSSProperties = { paddingBottom: "15px", marginBottom: "20px" };
const inputStyle = { padding: "12px", borderRadius: "6px", border: "1px solid #e0e0e0", flex: 1, outline: "none", fontSize: "0.95rem", color: "#000", backgroundColor: "#fff" };
const btnStyle = { padding: "12px", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "opacity 0.2s" };
const btnDeleteStyle = { padding: "6px 10px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" };
const tableStyle = { width: "100%", borderCollapse: "collapse" as "collapse", fontSize: "0.95rem" };

export default AdminPanel;