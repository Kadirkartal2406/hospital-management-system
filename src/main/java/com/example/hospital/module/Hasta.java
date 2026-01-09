package com.example.hospital.module;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate; // YENİ: Tarih için

@Entity
public class Hasta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hastaID;

    private String adSoyad;

    // ARTIK YAŞ YOK, DOĞUM TARİHİ VAR
    private LocalDate dogumTarihi;

    private String hastalik;

    // Getter & Setter
    public Long getHastaID() { return hastaID; }
    public void setHastaID(Long hastaID) { this.hastaID = hastaID; }

    public String getAdSoyad() { return adSoyad; }
    public void setAdSoyad(String adSoyad) { this.adSoyad = adSoyad; }

    public LocalDate getDogumTarihi() { return dogumTarihi; }
    public void setDogumTarihi(LocalDate dogumTarihi) { this.dogumTarihi = dogumTarihi; }

    public String getHastalik() { return hastalik; }
    public void setHastalik(String hastalik) { this.hastalik = hastalik; }
}