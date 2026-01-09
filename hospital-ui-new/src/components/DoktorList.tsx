import { useEffect, useState } from "react";
import api from "../api";
import { Doktor, TibbiBirim } from "../types";

const DoktorList = () => {
  const [doktorlar, setDoktorlar] = useState<Doktor[]>([]);
  const [birimler, setBirimler] = useState<TibbiBirim[]>([]); // Birim listesi için state

  // Başlangıç state'i
  const initialDoktorState = {
    doktorID: 0,
    adSoyad: "",
    uzmanlik: "",
    tibbiBirim: { birimID: 0, birimAdi: "" },
  };

  const [newDoktor, setNewDoktor] = useState<Doktor>(initialDoktorState);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Verileri çekme
  const fetchData = async () => {
    try {
      const docRes = await api.get("/doktor");
      setDoktorlar(docRes.data);

      const birimRes = await api.get("/tibbiBirim");
      setBirimler(birimRes.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addDoktor = () => {
    if (newDoktor.tibbiBirim.birimID === 0) {
      alert("Lütfen bir birim seçiniz!");
      return;
    }

    const payload = {
        adSoyad: newDoktor.adSoyad,
        uzmanlik: newDoktor.uzmanlik,
        tibbiBirim: { birimID: newDoktor.tibbiBirim.birimID }
    };

    api.post("/doktor", payload)
       .then(() => {
          alert("Doktor eklendi!");
          setNewDoktor(initialDoktorState);
          fetchData();
       })
       .catch((err) => {
         // Backend'den "Bu doktor zaten var" hatası gelirse burada yakalarız
         if(err.response && err.response.data) {
            alert("Hata: " + err.response.data);
         } else {
            alert("Doktor eklenemedi.");
         }
       });
  };

  const updateDoktor = () => {
    if (selectedId) {
      const payload = {
        adSoyad: newDoktor.adSoyad,
        uzmanlik: newDoktor.uzmanlik,
        tibbiBirim: { birimID: newDoktor.tibbiBirim.birimID }
      };

      api
        .put(`/doktor/${selectedId}`, payload)
        .then(() => {
            setNewDoktor(initialDoktorState);
            setIsEditing(false);
            setSelectedId(null);
            fetchData();
        });
    }
  };

  const deleteDoktor = (id: number) => {
    if(window.confirm("Doktoru silmek istediğinize emin misiniz?")) {
        api.delete(`/doktor/${id}`).then(() => fetchData());
    }
  };

  const handleEdit = (doktor: Doktor) => {
    setNewDoktor({
      doktorID: doktor.doktorID,
      adSoyad: doktor.adSoyad,
      uzmanlik: doktor.uzmanlik,
      tibbiBirim: {
          birimID: doktor.tibbiBirim.birimID,
          birimAdi: doktor.tibbiBirim.birimAdi
      },
    });
    setSelectedId(doktor.doktorID);
    setIsEditing(true);
  };

  return (
    <div>
      <h2>Doktor Yönetimi</h2>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
            placeholder="Ad Soyad"
            value={newDoktor.adSoyad}
            onChange={(e) =>
            setNewDoktor({ ...newDoktor, adSoyad: e.target.value })
            }
        />
        <input
            placeholder="Uzmanlık"
            value={newDoktor.uzmanlik}
            onChange={(e) =>
            setNewDoktor({ ...newDoktor, uzmanlik: e.target.value })
            }
        />

        {/* BİRİM SEÇİMİ (DROPDOWN) */}
        <select
            value={newDoktor.tibbiBirim.birimID}
            onChange={(e) => {
                const id = Number(e.target.value);
                setNewDoktor({
                    ...newDoktor,
                    tibbiBirim: { ...newDoktor.tibbiBirim, birimID: id }
                });
            }}
            style={{ padding: "5px" }}
        >
            <option value={0}>-- Birim Seçiniz --</option>
            {birimler.map((birim) => (
                <option key={birim.birimID} value={birim.birimID}>
                    {birim.birimAdi}
                </option>
            ))}
        </select>

        <button onClick={isEditing ? updateDoktor : addDoktor} style={{ background: isEditing ? "orange" : "blue", color: "white" }}>
            {isEditing ? "Güncelle" : "Ekle"}
        </button>
        {isEditing && (
             <button onClick={() => { setIsEditing(false); setNewDoktor(initialDoktorState); }} style={{ background: "gray", color: "white" }}>
                İptal
             </button>
        )}
      </div>

      <ul>
        {doktorlar.map((doktor) => (
          <li key={doktor.doktorID} style={{borderBottom: "1px solid #ccc", padding: "5px"}}>
            <strong>{doktor.adSoyad}</strong> - {doktor.uzmanlik}
            <span style={{color: "green", marginLeft: "10px"}}>
                [{doktor.tibbiBirim?.birimAdi || "Birim Yok"}]
            </span>
            <button onClick={() => deleteDoktor(doktor.doktorID)} style={{ marginLeft: "10px", background: "red", color: "white" }}>Sil</button>
            <button onClick={() => handleEdit(doktor)} style={{ marginLeft: "5px" }}>Düzenle</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoktorList;