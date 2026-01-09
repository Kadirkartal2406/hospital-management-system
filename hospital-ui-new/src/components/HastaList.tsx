import { useEffect, useState } from "react";
import api from "../api";
import { Hasta } from "../types";

const HastaList = () => {
  const [hastalar, setHastalar] = useState<Hasta[]>([]);

  // Form için varsayılan boş değerler
  const initialFormState = {
    hastaID: 0,
    adSoyad: "",
    yas: 0,
    hastalik: "",
  };

  const [newHasta, setNewHasta] = useState<Hasta>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  // Verileri çekme fonksiyonu
  const fetchHastalar = () => {
    api
      .get("/hasta")
      .then((res) => setHastalar(res.data))
      .catch(() => alert("Veriler alınamadı."));
  };

  useEffect(() => {
    fetchHastalar();
  }, []);

  // --- DÜZELTİLEN FONKSİYON (addHasta) ---
  const addHasta = () => {
    // 1. Backend'e gönderilecek nesneyi hazırlıyoruz.
    // DİKKAT: Burada 'hastaID' alanını bilerek eklemiyoruz!
    // Sadece adSoyad, yas ve hastalik gidiyor.
    const payload = {
        adSoyad: newHasta.adSoyad,
        yas: newHasta.yas,
        hastalik: newHasta.hastalik
    };

    api.post("/hasta", payload)
       .then(() => {
          alert("Hasta başarıyla eklendi!");
          setNewHasta(initialFormState); // Formu temizle
          fetchHastalar(); // Listeyi güncelle
       })
       .catch((err) => {
          console.error("Ekleme hatası:", err);
          alert("Kayıt eklenirken bir hata oluştu.");
       });
  };
  // ----------------------------------------

  const updateHasta = () => {
    // Güncelleme işleminde ID gitmesi zorunludur, burası doğru.
    if (newHasta.hastaID) {
      api
        .put(`/hasta/${newHasta.hastaID}`, newHasta)
        .then(() => {
          alert("Hasta güncellendi!");
          setIsEditing(false);
          setNewHasta(initialFormState);
          fetchHastalar();
        })
        .catch((err) => alert("Güncelleme başarısız: " + err));
    }
  };

  const deleteHasta = (id: number) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      api.delete(`/hasta/${id}`).then(() => {
        fetchHastalar();
      });
    }
  };

  const handleEdit = (hasta: Hasta) => {
    setNewHasta(hasta);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewHasta(initialFormState);
  };

  return (
    <div>
      <h2>Hasta Listesi</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Ad Soyad"
          value={newHasta.adSoyad}
          onChange={(e) => setNewHasta({ ...newHasta, adSoyad: e.target.value })}
        />
        <input
          type="number"
          placeholder="Yaş"
          value={newHasta.yas === 0 ? "" : newHasta.yas}
          onChange={(e) =>
            setNewHasta({ ...newHasta, yas: Number(e.target.value) })
          }
        />
        <input
          placeholder="Hastalık"
          value={newHasta.hastalik}
          onChange={(e) => setNewHasta({ ...newHasta, hastalik: e.target.value })}
        />
        <button onClick={isEditing ? updateHasta : addHasta}>
          {isEditing ? "Güncelle" : "Ekle"}
        </button>
        {isEditing && (
            <button onClick={handleCancel} style={{marginLeft: "10px", backgroundColor: "#f44336"}}>
                İptal
            </button>
        )}
      </div>

      <ul>
        {hastalar.map((hasta) => (
          <li key={hasta.hastaID} style={{ marginBottom: "5px" }}>
            {hasta.adSoyad} - {hasta.yas} - {hasta.hastalik}
            <button onClick={() => deleteHasta(hasta.hastaID)} style={{ marginLeft: "10px" }}>Sil</button>
            <button onClick={() => handleEdit(hasta)} style={{ marginLeft: "5px" }}>Düzenle</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HastaList;