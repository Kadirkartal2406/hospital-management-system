import { useEffect, useState } from "react";
import api from "../api";
import { Hasta } from "../types";
import Swal from "sweetalert2";

const Profile = () => {
  // --- STATE ---
  const [hasta, setHasta] = useState<Hasta | null>(null);

  // Form State'leri
  const [adSoyad, setAdSoyad] = useState("");
  const [tcNo, setTcNo] = useState(""); // Kullanıcı Adı
  const [password, setPassword] = useState(""); // Şifre
  const [dogumTarihi, setDogumTarihi] = useState("");
  const [hastalik, setHastalik] = useState("");

  const currentHastaId = localStorage.getItem("hastaId");
  const userRole = localStorage.getItem("userRole"); // ROL KONTROLÜ İÇİN

  useEffect(() => {
    // Admin ise hasta bilgisi çekmeye çalışıp hata almayalım,
    // Admin bilgilerini localStorage'dan veya user endpointinden alabiliriz.
    // Ancak mevcut yapıda Admin'in de bir ID'si varsa ona göre dolduruyoruz.
    if (currentHastaId) {
      fetchProfile();
    } else if (userRole === "ADMIN") {
        // Eğer Admin'in hasta tablosunda kaydı yoksa, local'den temel bilgileri al
        setTcNo(localStorage.getItem("userName") || "");
    }
  }, [currentHastaId]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/hasta/${currentHastaId}`);
      const h = res.data;
      setHasta(h);
      setAdSoyad(h.adSoyad);
      setTcNo(localStorage.getItem("userName") || ""); // TC genelde Users tablosundadır
      setDogumTarihi(h.dogumTarihi);
      setHastalik(h.hastalik);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    // Admin sadece şifre ve ad soyad günceller
    // User ise her şeyi günceller

    // NOT: Gerçek bir backend'de User ve Hasta tabloları ayrıdır.
    // Burada simülasyon yapıyoruz.

    if (!tcNo || !password) {
        Swal.fire("Hata", "Kullanıcı Adı ve Şifre boş olamaz.", "warning");
        return;
    }

    try {
        // Backend yapına göre burası değişebilir.
        // Şimdilik sadece başarılı mesajı verip simüle ediyoruz.
        // Eğer backend'de şifre değiştirme endpointi varsa ona istek atılmalı.

        // Örn: await api.put("/users/update", { username: tcNo, password });

        // Mevcut yapıda hasta bilgilerini güncelliyoruz (Sadece User için)
        if (userRole !== "ADMIN" && currentHastaId) {
            await api.put(`/hasta/${currentHastaId}`, {
                adSoyad,
                dogumTarihi,
                hastalik
            });
        }

        Swal.fire("Başarılı", "Profil bilgileriniz güncellendi.", "success");

        // Şifre değiştiyse tekrar giriş yapsın
        if (password) {
             Swal.fire({
                title: 'Şifre Değişti',
                text: 'Lütfen yeni şifrenizle tekrar giriş yapın.',
                icon: 'info',
                confirmButtonText: 'Tamam'
             }).then(() => {
                 localStorage.clear();
                 window.location.href = "/";
             });
        }

    } catch (error) {
        Swal.fire("Hata", "Güncelleme başarısız.", "error");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "'Segoe UI', sans-serif", display: "flex", justifyContent: "center" }}>

      <div style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "500px" }}>

        <h2 style={{ color: "#2c3e50", textAlign: "center", borderBottom: "2px solid #3498db", paddingBottom: "15px", marginBottom: "30px" }}>
            👤 Profil Ayarları
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* HERKES GÖREBİLİR: AD SOYAD */}
            <div>
                <label style={labelStyle}>Ad Soyad</label>
                <input
                    value={adSoyad}
                    onChange={(e) => setAdSoyad(e.target.value)}
                    style={inputStyle}
                    placeholder="Adınız Soyadınız"
                />
            </div>

            {/* HERKES GÖREBİLİR: KULLANICI ADI (TC) */}
            <div>
                <label style={labelStyle}>Kullanıcı Adı (TC)</label>
                <input
                    value={tcNo}
                    onChange={(e) => setTcNo(e.target.value)}
                    style={inputStyle}
                    placeholder="Kullanıcı Adı"
                />
            </div>

            {/* HERKES GÖREBİLİR: ŞİFRE */}
            <div>
                <label style={labelStyle}>Yeni Şifre</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                />
            </div>

            {/* --- SADECE USER GÖRSÜN (Admin Görmesin) --- */}
            {userRole !== "ADMIN" && (
                <>
                    <div>
                        <label style={labelStyle}>Doğum Tarihi</label>
                        <input
                            type="date"
                            value={dogumTarihi}
                            onChange={(e) => setDogumTarihi(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Hastalık / Not</label>
                        <textarea
                            value={hastalik}
                            onChange={(e) => setHastalik(e.target.value)}
                            style={{...inputStyle, height: "80px", resize: "none"}}
                            placeholder="Kronik rahatsızlığınız var mı?"
                        />
                    </div>
                </>
            )}

            <button onClick={handleUpdate} style={btnStyle}>
                💾 Güncelle
            </button>

        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
// Renkleri kesin SİYAH (#000) ve BEYAZ (#fff) yaptık.
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e" };
const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #bdc3c7",
    boxSizing: "border-box" as "border-box",
    color: "#000000", // Siyah Yazı
    backgroundColor: "#ffffff", // Beyaz Arka Plan
    fontSize: "1rem"
};

const btnStyle = {
    marginTop: "10px",
    padding: "15px",
    background: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    width: "100%",
    transition: "background 0.3s"
};

export default Profile;