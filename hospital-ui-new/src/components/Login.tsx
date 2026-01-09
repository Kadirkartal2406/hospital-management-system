import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = ({ setUserRole }: { setUserRole: (role: string) => void }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // true = Giriş, false = Kayıt
  const navigate = useNavigate();

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [regAdSoyad, setRegAdSoyad] = useState("");
  const [regTc, setRegTc] = useState("");
  const [regSifre, setRegSifre] = useState("");
  const [regDogumTarihi, setRegDogumTarihi] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        kullaniciAdi: username,
        sifre: password
      });

      if (res.data.status === "success") {
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userName", res.data.username);
        // HASTA ID'Yİ KAYDET (Önemli: Randevu alırken lazım)
        localStorage.setItem("hastaId", res.data.hastaId);

        setUserRole(res.data.role);
        navigate("/");
      }
    } catch (error) {
      alert("Giriş Başarısız! Bilgileri kontrol edin.");
    }
  };

const handleRegister = async () => {
    if(!regAdSoyad || !regTc || !regSifre || !regDogumTarihi) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    try {
        const payload = {
            adSoyad: regAdSoyad,
            tcNo: regTc,
            sifre: regSifre,
            dogumTarihi: regDogumTarihi,
            hastalik: "Genel Kontrol"
        };

        await api.post("/auth/register", payload);
        alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
        setIsLoginMode(true);
    } catch (error: any) {
        console.error("Kayıt Hatası Detay:", error);

        // Backend'den gelen gerçek hata mesajını yakala
        if (error.response && error.response.data) {
             // Spring Boot genelde hatayı 'message' alanında gönderir
             // Eğer JSON olarak { "message": "..." } geliyorsa:
             const serverMessage = error.response.data.message || error.response.data.error || "Bilinmeyen hata";
             alert("Kayıt Başarısız: " + serverMessage);
        } else {
             alert("Sunucuyla iletişim kurulamadı.");
        }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* SEKMELER (GİRİŞ / KAYIT) */}
        <div style={{display: "flex", justifyContent: "space-around", marginBottom: "20px"}}>
            <h3
                onClick={() => setIsLoginMode(true)}
                style={{
                    cursor: "pointer",
                    color: isLoginMode ? "#2c3e50" : "#bdc3c7",
                    borderBottom: isLoginMode ? "3px solid #3498db" : "3px solid transparent",
                    paddingBottom: "5px"
                }}
            >
                Giriş Yap
            </h3>
            <h3
                onClick={() => setIsLoginMode(false)}
                style={{
                    cursor: "pointer",
                    color: !isLoginMode ? "#2c3e50" : "#bdc3c7",
                    borderBottom: !isLoginMode ? "3px solid #27ae60" : "3px solid transparent",
                    paddingBottom: "5px"
                }}
            >
                Kayıt Ol
            </h3>
        </div>

        {isLoginMode ? (
            // --- GİRİŞ FORMU ---
            <>
                <div style={{marginBottom: "15px"}}>
                    <label style={labelStyle}>Kullanıcı Adı / TC</label>
                    <input placeholder="Giriş yapacağınız TC no" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
                </div>
                <div style={{marginBottom: "20px"}}>
                    <label style={labelStyle}>Şifre</label>
                    <input type="password" placeholder="Şifreniz" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <button onClick={handleLogin} style={buttonStyle}>Giriş Yap</button>
            </>
        ) : (
            // --- KAYIT FORMU ---
            <>
                <input placeholder="Ad Soyad" value={regAdSoyad} onChange={(e) => setRegAdSoyad(e.target.value)} style={inputStyle} />
                <input placeholder="TC Kimlik No (Kullanıcı Adı)" value={regTc} onChange={(e) => setRegTc(e.target.value)} style={inputStyle} />

                {/* DOĞUM TARİHİ INPUTU */}
                <div style={{marginBottom: "10px", textAlign: "left"}}>
                    <label style={{fontSize:"13px", color:"#777", display: "block", marginBottom: "3px"}}>Doğum Tarihi:</label>
                    <input type="date" value={regDogumTarihi} onChange={(e) => setRegDogumTarihi(e.target.value)} style={inputStyle} />
                </div>

                <input type="password" placeholder="Şifre Belirleyin" value={regSifre} onChange={(e) => setRegSifre(e.target.value)} style={inputStyle} />
                <button onClick={handleRegister} style={{...buttonStyle, backgroundColor: "#27ae60"}}>Kayıt Ol</button>
            </>
        )}

      </div>
    </div>
  );
};

// CSS Stilleri
const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#ecf0f1",
    fontFamily: "'Segoe UI', sans-serif"
};

const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "400px",
    textAlign: "center"
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box"
};

const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s"
};

const labelStyle: React.CSSProperties = {
    display: "block",
    textAlign: "left",
    marginBottom: "5px",
    color: "#7f8c8d",
    fontSize: "14px"
};

export default Login;