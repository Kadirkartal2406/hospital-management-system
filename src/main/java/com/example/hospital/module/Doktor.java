package com.example.hospital.module;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Doktor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BU SATIR EKLENDİ (Çok Önemli!)
    private Long doktorID;

    private String adSoyad;
    private String uzmanlik;

    @ManyToOne // targetEntity belirtmeye gerek yok, tipinden anlar
    @JoinColumn(name = "birim")
    private TibbiBirim tibbiBirim;

    @OneToMany(mappedBy = "doktor", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<HastaKayit> hastaKayitList;

    public Doktor(Long doktorID, String adSoyad, String uzmanlik, TibbiBirim tibbiBirim) {
        this.doktorID = doktorID;
        this.adSoyad = adSoyad;
        this.uzmanlik = uzmanlik;
        this.tibbiBirim = tibbiBirim;
    }

    public Doktor() {
    }

    public Long getDoktorID() {
        return doktorID;
    }

    public void setDoktorID(Long doktorID) {
        this.doktorID = doktorID;
    }

    public String getAdSoyad() {
        return adSoyad;
    }

    public void setAdSoyad(String adSoyad) {
        this.adSoyad = adSoyad;
    }

    public String getUzmanlik() {
        return uzmanlik;
    }

    public void setUzmanlik(String uzmanlik) {
        this.uzmanlik = uzmanlik;
    }

    public TibbiBirim getTibbiBirim() {
        return tibbiBirim;
    }

    public void setTibbiBirim(TibbiBirim tibbiBirim) {
        this.tibbiBirim = tibbiBirim;
    }

    @Override
    public String toString() {
        return "Doktor{" +
                "doktorID=" + doktorID +
                ", adSoyad='" + adSoyad + '\'' +
                ", uzmanlik='" + uzmanlik + '\'' +
                ", tibbiBirim=" + tibbiBirim +
                '}';
    }
}