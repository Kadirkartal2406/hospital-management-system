import { useEffect, useState } from "react";
import api from "../api";
import { Hasta, HastaKayit } from "../types";
import Swal from "sweetalert2";

const UsersPanel = () => {
  const [hastaBilgi, setHastaBilgi] = useState<Hasta | null>(null);
  const [randevular, setRandevular] = useState<HastaKayit[]>([]);

  const currentUserName = localStorage.getItem("userName"); // TC No
  const currentHastaId = localStorage.getItem("hastaId");

  useEffect(() => {
    if (currentHastaId) {
      fetchHastaBilgileri();
      fetchRandevular();
    }
  }, [currentHastaId]);

  // 1. KENDİ PROFİL BİLGİLERİNİ ÇEK
  const fetchHastaBilgileri = async () => {
    try {
      const res = await api.get(`/hasta/${currentHastaId}`);
      setHastaBilgi(res.data);
    } catch (error) {
      console.error("Profil yüklenemedi", error);
    }
  };

  // 2. SADECE KENDİ RANDEVULARINI ÇEK
  const fetchRandevular = async () => {
    try {
      // Backend zaten role=USER ve username gönderince filtreliyor
      const res = await api.get(`/hastaKayit?role=USER&username=${currentUserName}`);
      setRandevular(res.data);
    } catch (error) {
      console.error("Randevular yüklenemedi", error);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* BAŞLIK */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#2c3e50", margin: 0 }}>👋 Merhaba, {hastaBilgi?.adSoyad || "Misafir"}</h2>
        <p style={{ color: "#7f8c8d" }}>Hoş geldiniz, işte sağlık özetiniz.</p>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* SOL KART: HASTA BİLGİLERİ */}
        <div style={{ flex: 1, background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", minWidth: "300px" }}>
          <h3 style={{ marginTop: 0, color: "#3498db", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>👤 Kimlik Bilgilerim</h3>

          <div style={infoRowStyle}>
            <span style={labelStyle}>TC Kimlik No:</span>
            <span style={valueStyle}>{currentUserName}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Ad Soyad:</span>
            <span style={valueStyle}>{hastaBilgi?.adSoyad}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Doğum Tarihi:</span>
            <span style={valueStyle}>{hastaBilgi?.dogumTarihi}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Kayıtlı Hastalık:</span>
            <span style={{...valueStyle, color: "#e67e22"}}>{hastaBilgi?.hastalik || "Yok"}</span>
          </div>
        </div>

        {/* SAĞ KART: AKTİF RANDEVULAR */}
        <div style={{ flex: 2, background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", minWidth: "300px" }}>
          <h3 style={{ marginTop: 0, color: "#27ae60", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>📅 Aktif Randevularım</h3>

          {randevular.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#7f8c8d" }}>
                  <th style={{ padding: "10px" }}>Tarih</th>
                  <th style={{ padding: "10px" }}>Bölüm</th>
                  <th style={{ padding: "10px" }}>Doktor</th>
                </tr>
              </thead>
              <tbody>
                {randevular.map((r) => (
                  <tr key={r.kayitID} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "10px", fontWeight: "bold", color: "#2c3e50" }}>
                      {new Date(r.tarih).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td style={{ padding: "10px", color: "#000" }}>{r.tibbiBirim.birimAdi}</td>
                    <td style={{ padding: "10px", color: "#000" }}>{r.doktor.adSoyad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "#95a5a6" }}>
              <p>Aktif randevunuz bulunmamaktadır.</p>
              <a href="/kayit" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>Randevu Al →</a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Styles
const infoRowStyle = { display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px dashed #eee", paddingBottom: "5px" };
const labelStyle = { color: "#7f8c8d", fontWeight: "600" };
const valueStyle = { color: "#2c3e50", fontWeight: "bold" };

export default UsersPanel;