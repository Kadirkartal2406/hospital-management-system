import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import HastaKayitList from "./components/HastaKayitList";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";
import UsersPanel from "./components/UsersPanel";

const AppContent = () => {
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("userRole"));
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("userRole"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!userRole) {
    return <Login setUserRole={setUserRole} />;
  }

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* --- SOL MENÜ (SIDEBAR) --- */}
      <div style={sidebarStyle}>

        {/* LOGO ALANI */}
        <div style={{ paddingBottom: "20px", borderBottom: "1px solid #34495e", marginBottom: "20px" }}>
          <h2 style={{ color: "#ecf0f1", margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            🏥 <span>E-Hastane</span>
          </h2>
          <div style={{ color: "#bdc3c7", fontSize: "0.85rem", marginTop: "5px", opacity: 0.8 }}>
            {userRole === "ADMIN" ? "Yönetici Paneli" : "Hasta Paneli"}
          </div>
        </div>

        {/* LİNKLER (Yukarıda duracak) */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          <Link to="/" style={getLinkStyle(location.pathname === "/")}>
            {userRole === "ADMIN" ? "👥 Tüm Hastalar" : "🏠 Ana Sayfam"}
          </Link>

          {userRole === "ADMIN" && (
            <Link to="/admin" style={getLinkStyle(location.pathname === "/admin")}>
              ⚙️ Hastane Yönetimi
            </Link>
          )}

          <Link to="/kayit" style={getLinkStyle(location.pathname === "/kayit")}>
            {userRole === "ADMIN" ? "📅 Randevu Listesi" : "📅 Randevu Al"}
          </Link>

          <Link to="/profil" style={getLinkStyle(location.pathname === "/profil")}>
            👤 Profilim
          </Link>

        </nav>

        {/* ÇIKIŞ BUTONU (En alta itildi) */}
        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #34495e" }}>
          <button onClick={handleLogout} style={logoutBtnStyle}>
            🚪 Güvenli Çıkış
          </button>
        </div>
      </div>

      {/* --- SAĞ İÇERİK --- */}
      <div style={{ flex: 1, backgroundColor: "#ecf0f1", overflowY: "auto", padding: "0" }}>
        <Routes>
          <Route path="/" element={userRole === "ADMIN" ? <Home /> : <UsersPanel />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/kayit" element={<HastaKayitList />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

// --- STYLES ---
const sidebarStyle: React.CSSProperties = {
  width: "280px",
  height: "100vh",
  background: "#2c3e50", // Koyu modern renk
  color: "white",
  padding: "25px",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
};

const getLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 15px",
  color: isActive ? "#ffffff" : "#bdc3c7",
  background: isActive ? "#3498db" : "transparent", // Aktifse mavi, değilse şeffaf
  textDecoration: "none",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  fontWeight: isActive ? "600" : "400",
  fontSize: "0.95rem"
});

const logoutBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#e74c3c", // Kırmızı çıkış butonu
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background 0.3s"
};

export default App;