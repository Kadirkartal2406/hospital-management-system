package com.example.hospital.module;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class TibbiBirim {
    @Id
    // SEQUENCE yerine IDENTITY kullanıyoruz (Diğer dosyalarla uyumlu olması için)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long birimID;

    private String birimAdi;

    @OneToMany(mappedBy = "tibbiBirim", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Doktor> doktorList;

    @OneToMany(mappedBy = "tibbiBirim", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<HastaKayit> hastaKayitList;

    public TibbiBirim(Long birimID, String birimAdi) {
        this.birimID = birimID;
        this.birimAdi = birimAdi;
    }

    public TibbiBirim() {

    }

    public String getBirimAdi() {
        return birimAdi;
    }

    public void setBirimAdi(String birimAdi) {
        this.birimAdi = birimAdi;
    }

    public Long getBirimID() {
        return birimID;
    }

    public void setBirimID(Long birimID) {
        this.birimID = birimID;
    }

    @Override
    public String toString() {
        return "TibbiBirim{" +
                "birimID=" + birimID +
                ", birimAdi='" + birimAdi + '\'' +
                '}';
    }
}