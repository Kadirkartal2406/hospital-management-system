import { useEffect, useState } from "react";
import api from "../api";
import { TibbiBirim } from "../types";

const TibbiBirimList = () => {
  const [birimler, setBirimler] = useState<TibbiBirim[]>([]);
  const [newBirim, setNewBirim] = useState({ birimAdi: "" });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Verileri çekme
  const fetchBirimler = () => {
    api.get("/tibbiBirim")
       .then((res) => setBirimler(res.data))
       .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBirimler();
  }, []);

  const addBirim = () => {
    if (!newBirim.birimAdi.trim()) {
      alert("Lütfen birim adını giriniz!");
      return;
    }

    api.post("/tibbiBirim", newBirim)
       .then(() => {
          alert("Birim başarıyla eklendi!");
          setNewBirim({ birimAdi: "" });
          fetchBirimler();
       })
       .catch((err) => {
          alert("Hata: " + (err.response?.data || "Birim eklenemedi."));
       });
  };

  const updateBirim = () => {
    if (!newBirim.birimAdi.trim()) {
      alert("Birim adı boş olamaz!");
      return;
    }

    if (selectedId) {
      api.put(`/tibbiBirim/${selectedId}`, newBirim).then(() => {
        alert("Güncelleme başarılı!");
        setNewBirim({ birimAdi: "" });
        setIsEditing(false);
        setSelectedId(null);
        fetchBirimler();
      });
    }
  };

  const deleteBirim = (id: number) => {
    if(window.confirm("Bu birimi silmek istiyor musunuz?")) {
        api.delete(`/tibbiBirim/${id}`)
           .then(() => fetchBirimler())
           .catch((err) => alert("Silinemedi. Bu birime bağlı doktorlar olabilir."));
    }
  };

  const handleEdit = (birim: TibbiBirim) => {
    setNewBirim({ birimAdi: birim.birimAdi });
    setSelectedId(birim.birimID);
    setIsEditing(true);
  };

  return (
    <div>
      <h2>Tıbbi Birimler</h2>
      <div style={{ marginBottom: "20px" }}>
        {/* Input alanının da yazı rengini garantiye alalım */}
        <input
            placeholder="Birim Adı Giriniz..."
            value={newBirim.birimAdi}
            onChange={(e) => setNewBirim({ birimAdi: e.target.value })}
            style={{ padding: "8px", width: "250px", color: "#000", backgroundColor: "#fff" }}
        />
        <button
            onClick={isEditing ? updateBirim : addBirim}
            style={{ marginLeft: "10px", backgroundColor: isEditing ? "orange" : "blue", color: "white" }}
        >
            {isEditing ? "Güncelle" : "Ekle"}
        </button>

        {isEditing && (
            <button onClick={() => { setIsEditing(false); setNewBirim({ birimAdi: "" }); }} style={{marginLeft: "10px", background: "gray", color: "white"}}>
                İptal
            </button>
        )}
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {birimler.map((birim) => (
          <li key={birim.birimID}
              style={{
                  background: "#f9f9f9",
                  color: "#333", /* DÜZELTME: Yazı rengi koyu yapıldı */
                  margin: "5px 0",
                  padding: "10px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "5px"
              }}>
            <span><strong>{birim.birimAdi}</strong> <span style={{fontSize: "0.8em", color: "#666"}}>(ID: {birim.birimID})</span></span>
            <div>
                <button onClick={() => handleEdit(birim)} style={{ marginRight: "5px", background: "#ffc107", color: "black", border: "none" }}>Düzenle</button>
                <button onClick={() => deleteBirim(birim.birimID)} style={{ background: "#f44336", color: "white", border: "none" }}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TibbiBirimList;