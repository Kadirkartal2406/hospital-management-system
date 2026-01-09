import { useEffect, useState } from "react";
import api from "../api";
import { HastaKayit, Doktor, TibbiBirim } from "../types";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const HastaKayitList = () => {
  // --- STATE TANIMLARI ---
  const [hastaKayitlar, setHastaKayitlar] = useState<HastaKayit[]>([]);
  const [stats, setStats] = useState({ toplamDoktor: 0, toplamHasta: 0 });

  // Arama State'i
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdown Verileri
  const [tumDoktorlar, setTumDoktorlar] = useState<Doktor[]>([]);
  const [filteredDoktorlar, setFilteredDoktorlar] = useState<Doktor[]>([]);
  const [birimler, setBirimler] = useState<TibbiBirim[]>([]);

  // -- EKLEME FORMU STATE'LERİ --
  const [addDoktorID, setAddDoktorID] = useState<string>("");
  const [addBirimID, setAddBirimID] = useState<string>("");
  const [selectedDatePart, setSelectedDatePart] = useState<string>("");
  const [selectedTimePart, setSelectedTimePart] = useState<string>("");

  // Kullanıcı Bilgileri
  const currentUserRole = localStorage.getItem("userRole");
  const currentUserName = localStorage.getItem("userName");
  const currentHastaId = localStorage.getItem("hastaId");

  // --- GRAFİK VERİSİ HAZIRLAMA ---
  const preparePieData = () => {
    const counts: { [key: string]: number } = {};
    hastaKayitlar.forEach(k => {
        const birim = k.tibbiBirim.birimAdi;
        counts[birim] = (counts[birim] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  };

  const prepareBarData = () => {
    const counts: { [key: string]: number } = {};
    hastaKayitlar.forEach(k => {
        const dr = k.doktor.adSoyad;
        counts[dr] = (counts[dr] || 0) + 1;
    });
    // Burada slice(0, 5) sınırını kaldırabilirsin istersen tüm doktorları görmek için
    return Object.keys(counts).map(key => ({ name: key, hastaSayisi: counts[key] }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // --- ARAMA FİLTRESİ ---
  const filteredKayitlar = hastaKayitlar.filter((k) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
        k.tibbiBirim.birimAdi.toLowerCase().includes(term) ||
        k.doktor.adSoyad.toLowerCase().includes(term) ||
        (k.hasta?.adSoyad || "").toLowerCase().includes(term) ||
        (k.olusturan || "").toLowerCase().includes(term)
    );
  });

  // --- PDF ÇIKTISI (SADECE USER) ---
  const handlePrint = async (kayit: HastaKayit) => {
    Swal.fire({ title: 'Hazırlanıyor...', text: 'Lütfen bekleyin.', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const doc = new jsPDF();
        const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf";
        const fontResponse = await fetch(fontUrl);
        const fontBlob = await fontResponse.blob();
        const reader = new FileReader();
        reader.readAsDataURL(fontBlob);

        reader.onloadend = () => {
            const base64data = reader.result as string;
            const fontBase64 = base64data.split(',')[1];
            doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");

            doc.setLineWidth(0.5); doc.rect(10, 10, 190, 100);
            doc.setFontSize(22); doc.setTextColor(44, 62, 80);
            doc.text("ÖZEL MEDENİYET HASTANESİ", 105, 25, { align: "center" });
            doc.setFontSize(12); doc.setTextColor(100);
            doc.text("Randevu Onay Fişi", 105, 32, { align: "center" });
            doc.line(20, 36, 190, 36);

            doc.setTextColor(0); doc.setFontSize(12);
            const startY = 50; const gap = 10;
            doc.text("Hasta Adı:", 30, startY); doc.text(kayit.hasta.adSoyad || "-", 80, startY);

            const rawTC = currentUserName || "";
            const maskedTC = rawTC.length >= 5 ? `${rawTC.substring(0, 3)}******${rawTC.substring(rawTC.length - 2)}` : "***********";
            doc.text("TC Kimlik:", 30, startY + gap); doc.text(maskedTC, 80, startY + gap);

            doc.text("Bölüm:", 30, startY + gap * 2); doc.text(kayit.tibbiBirim.birimAdi, 80, startY + gap * 2);
            doc.text("Doktor:", 30, startY + gap * 3); doc.text(kayit.doktor.adSoyad, 80, startY + gap * 3);

            const tarihStr = new Date(kayit.tarih).toLocaleString("tr-TR");
            doc.text("Tarih / Saat:", 30, startY + gap * 4); doc.text(tarihStr, 80, startY + gap * 4);

            doc.line(20, 95, 190, 95); doc.setFontSize(10); doc.setTextColor(150);
            doc.text(`Ref No: #${kayit.kayitID} - Lütfen randevu saatinden 15 dk önce geliniz.`, 105, 103, { align: "center" });

            doc.save(`Randevu_Fisi_${kayit.kayitID}.pdf`);
            Swal.close();
        };
    } catch (error) { Swal.fire("Hata", "Fiş oluşturulamadı.", "error"); }
  };

  // --- DİĞER FONKSİYONLAR ---
  const getNext15Days = () => {
    const dates = []; const today = new Date(); let i = 0; let daysFound = 0;
    while (daysFound < 15) {
        const d = new Date(today); d.setDate(today.getDate() + i);
        const gun = d.getDay();
        if (gun !== 0 && gun !== 6) {
            const year = d.getFullYear(); const month = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0');
            const value = `${year}-${month}-${day}`;
            const label = d.toLocaleDateString("tr-TR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            dates.push({ value, label }); daysFound++;
        } i++;
    } return dates;
  };

  const getValidTimes = () => {
    const times = [];
    for (let h = 8; h < 12; h++) { for (let m = 0; m < 60; m += 15) times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`); }
    for (let h = 13; h < 17; h++) { for (let m = 0; m < 60; m += 15) times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`); }
    if (selectedDatePart) {
        const todayStr = new Date().toISOString().split("T")[0];
        if (selectedDatePart === todayStr) {
            const now = new Date(); const currentHour = now.getHours(); const currentMinute = now.getMinutes();
            return times.filter(t => { const [h, m] = t.split(":").map(Number); return h > currentHour || (h === currentHour && m > currentMinute); });
        }
    } return times;
  };

  useEffect(() => { refreshData(); fetchDropdowns(); if (currentUserRole === "ADMIN") fetchStats(); }, [currentUserName]);
  useEffect(() => { addBirimID ? setFilteredDoktorlar(tumDoktorlar.filter((d) => d.tibbiBirim.birimID === Number(addBirimID))) : setFilteredDoktorlar([]); }, [addBirimID, tumDoktorlar]);

  const refreshData = () => { api.get(`/hastaKayit?role=${currentUserRole}&username=${currentUserName}`).then((res) => setHastaKayitlar(res.data)).catch((err) => console.error(err)); };
  const fetchStats = () => { api.get("/dashboard/stats").then((res) => setStats(res.data)).catch(console.error); };
  const fetchDropdowns = async () => { try { const dRes = await api.get("/doktor"); setTumDoktorlar(dRes.data); const bRes = await api.get("/tibbiBirim"); setBirimler(bRes.data); } catch (error) { console.error(error); } };

  // --- KAYIT EKLEME (Sadece User) ---
  const handleSave = async () => {
    if (!currentHastaId || !addDoktorID || !addBirimID || !selectedDatePart || !selectedTimePart) { Swal.fire({ icon: 'warning', title: 'Eksik Bilgi', text: 'Tüm alanları doldurunuz.' }); return; }
    const payload = { durum: "Aktif", tarih: `${selectedDatePart}T${selectedTimePart}`, hasta: { hastaID: Number(currentHastaId) }, doktor: { doktorID: Number(addDoktorID) }, tibbiBirim: { birimID: Number(addBirimID) }, olusturan: currentUserName };
    try { await api.post("/hastaKayit", payload); Swal.fire({ icon: 'success', title: 'Başarılı', timer: 1500, showConfirmButton: false }); refreshData(); setAddDoktorID(""); setAddBirimID(""); setSelectedDatePart(""); setSelectedTimePart(""); } catch (error: any) { Swal.fire({ icon: 'error', title: 'Hata', text: error.response?.data?.message || "Hata oluştu" }); }
  };

  const handleDelete = (id: number) => {
    Swal.fire({ title: 'Emin misiniz?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Evet, Sil!' }).then((result) => {
        if (result.isConfirmed) api.delete(`/hastaKayit/${id}`).then(() => { refreshData(); Swal.fire('Silindi!', '', 'success'); });
    });
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* 1. ÜST PANEL (ADMIN DASHBOARD + GRAFİKLER) */}
      {currentUserRole === "ADMIN" ? (
        <div style={{ marginBottom: "40px" }}>
            <h2 style={{ color: "#2c3e50", borderBottom: "3px solid #e74c3c", display: "inline-block", paddingBottom: "5px" }}>🛡️ Yönetici Dashboard</h2>

            {/* KARTLAR */}
            <div style={{ display: "flex", gap: "20px", marginTop: "20px", marginBottom: "30px" }}>
                <div style={statCardStyle}><span style={{fontSize: "2.5rem"}}>👨‍⚕️</span><div><div style={statNumberStyle}>{stats.toplamDoktor}</div><div style={{color: "#7f8c8d"}}>Doktor</div></div></div>
                <div style={statCardStyle}><span style={{fontSize: "2.5rem"}}>🤒</span><div><div style={statNumberStyle}>{stats.toplamHasta}</div><div style={{color: "#7f8c8d"}}>Hasta</div></div></div>
                <div style={statCardStyle}><span style={{fontSize: "2.5rem"}}>📅</span><div><div style={statNumberStyle}>{hastaKayitlar.length}</div><div style={{color: "#7f8c8d"}}>Randevu</div></div></div>
            </div>

            {/* GRAFİKLER */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <div style={chartContainerStyle}>
                    <h4 style={{textAlign: "center", color: "#555"}}>Poliklinik Yoğunluğu</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={preparePieData()} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                                {preparePieData().map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={chartContainerStyle}>
                    <h4 style={{textAlign: "center", color: "#555"}}>En Yoğun Doktorlar</h4>
                    <ResponsiveContainer width="100%" height={300}> {/* Height artırıldı */}
                        <BarChart data={prepareBarData()} margin={{bottom: 50}}> {/* Alt marjin artırıldı */}
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                interval={0} // HEPSİNİ GÖSTER
                                angle={-45}  // YAN ÇEVİR
                                textAnchor="end" // DÜZGÜN HİZALA
                                tick={{fontSize: 10, fill: "#000"}} // SİYAH RENK
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="hastaSayisi" fill="#82ca9d" name="Hasta Sayısı" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      ) : (
        // USER GÖRÜNÜMÜ
        <div style={{ marginBottom: "40px" }}>
            <h2 style={{ color: "#27ae60" }}>📅 Randevu Al</h2>
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{padding: "10px", background: "#ecf0f1", borderRadius: "4px", fontWeight: "bold", color: "#000"}}>👤 {currentUserName}</div>
                <select value={addBirimID} onChange={(e) => setAddBirimID(e.target.value)} style={inputStyle}><option value="">-- Bölüm Seç --</option>{birimler.map((b) => (<option key={b.birimID} value={b.birimID} style={{color: "#000"}}>{b.birimAdi}</option>))}</select>
                <select value={addDoktorID} onChange={(e) => setAddDoktorID(e.target.value)} style={inputStyle} disabled={!addBirimID}><option value="">{addBirimID ? "-- Doktor Seç --" : "-- Önce Bölüm --"}</option>{filteredDoktorlar.map((d) => (<option key={d.doktorID} value={d.doktorID} style={{color: "#000"}}>{d.adSoyad}</option>))}</select>
                <select value={selectedDatePart} onChange={(e) => {setSelectedDatePart(e.target.value); setSelectedTimePart("");}} style={inputStyle}><option value="">-- Tarih --</option>{getNext15Days().map((d) => (<option key={d.value} value={d.value} style={{color: "#000"}}>{d.label}</option>))}</select>
                <select value={selectedTimePart} onChange={(e) => setSelectedTimePart(e.target.value)} style={inputStyle} disabled={!selectedDatePart}><option value="">{selectedDatePart ? "-- Saat --" : "-- Önce Tarih --"}</option>{getValidTimes().map((time) => (<option key={time} value={time} style={{color: "#000"}}>{time}</option>))}</select>
                <button onClick={handleSave} style={btnSuccessStyle}>Oluştur</button>
            </div>
        </div>
      )}

      {/* 2. ARAMA VE LİSTE */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
        <h3 style={{ color: "#34495e", margin: 0 }}>📋 Randevu Listesi</h3>

        <input
            type="text"
            placeholder="🔍 Ara: İsim, Doktor, Bölüm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", width: "300px", borderRadius: "20px", border: "1px solid #ccc", outline: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", color: "#000", backgroundColor: "#fff" }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
            <tr style={{ background: "#34495e", color: "white", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Tarih</th>
                <th style={{ padding: "12px" }}>Bölüm</th>
                <th style={{ padding: "12px" }}>Doktor</th>
                <th style={{ padding: "12px" }}>{currentUserRole === "ADMIN" ? "Hasta (TC)" : "Durum"}</th>
                <th style={{ padding: "12px" }}>İşlemler</th>
            </tr>
        </thead>
        <tbody>
            {filteredKayitlar.length > 0 ? (
                filteredKayitlar.map((k) => (
                    <tr key={k.kayitID} style={{ borderBottom: "1px solid #eee", backgroundColor: "#ffffff" }}>
                        <td style={{ padding: "12px", fontWeight: "bold", color: "#000000" }}>{k.tarih ? new Date(k.tarih).toLocaleString("tr-TR", {dateStyle: 'short', timeStyle: 'short'}) : "-"}</td>
                        <td style={{ padding: "12px" }}><span style={{background: "#e8f6f3", color: "#000000", padding: "4px 8px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold"}}>{k.tibbiBirim?.birimAdi}</span></td>
                        <td style={{ padding: "12px", color: "#000000" }}>{k.doktor?.adSoyad}</td>
                        <td style={{ padding: "12px", fontWeight: "bold", color: currentUserRole === "ADMIN" ? "#2980b9" : "#27ae60" }}>{currentUserRole === "ADMIN" ? k.olusturan : "Aktif"}</td>
                        <td style={{ padding: "12px", display: "flex", gap: "10px" }}>
                            {currentUserRole === "ADMIN" ? (
                                <span style={{color: "#000000", fontSize: "0.9rem"}}>Görüntüleme Modu</span>
                            ) : (
                                <button onClick={() => handlePrint(k)} style={btnPrintStyle}>🖨️ Yazdır</button>
                            )}
                        </td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan={5} style={{textAlign: "center", padding: "20px", color: "#000"}}>Kayıt bulunamadı.</td></tr>
            )}
        </tbody>
      </table>
    </div>
  );
};

// --- STİLLER ---
const statCardStyle = { flex: 1, background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "15px", minWidth: "200px" };
const statNumberStyle = { fontSize: "1.5rem", fontWeight: "bold", color: "#2c3e50" };
const chartContainerStyle = { flex: 1, background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", minWidth: "300px" };
const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ddd", minWidth: "140px", color: "#000000", backgroundColor: "#ffffff" };
const btnSuccessStyle = { background: "#27ae60", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const btnPrintStyle = { background: "#3498db", color: "white", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" };

export default HastaKayitList;