package com.example.hospital.module;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class HastaKayit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kayitID;

    @ManyToOne
    @JoinColumn(name="hasta", referencedColumnName = "hastaID")
    private Hasta hasta;

    @ManyToOne
    @JoinColumn(name = "birim", referencedColumnName = "birimID")
    private TibbiBirim tibbiBirim;

    @ManyToOne
    @JoinColumn(name = "doktor", referencedColumnName = "doktorID")
    private Doktor doktor;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime tarih;

    private String durum;

    // --- YENİ EKLENEN ALAN: Kaydı oluşturan kullanıcı adı (admin, user vb.) ---
    private String olusturan;

    // --- CONSTRUCTORLAR ---
    public HastaKayit() {
    }

    public HastaKayit(Long kayitID, Hasta hasta, TibbiBirim tibbiBirim, Doktor doktor, LocalDateTime tarih, String durum, String olusturan) {
        this.kayitID = kayitID;
        this.hasta = hasta;
        this.tibbiBirim = tibbiBirim;
        this.doktor = doktor;
        this.tarih = tarih;
        this.durum = durum;
        this.olusturan = olusturan;
    }

    // --- GETTER VE SETTERLAR ---

    public Long getKayitID() {
        return kayitID;
    }

    public void setKayitID(Long kayitID) {
        this.kayitID = kayitID;
    }

    public Hasta getHasta() {
        return hasta;
    }

    public void setHasta(Hasta hasta) {
        this.hasta = hasta;
    }

    public TibbiBirim getTibbiBirim() {
        return tibbiBirim;
    }

    public void setTibbiBirim(TibbiBirim tibbiBirim) {
        this.tibbiBirim = tibbiBirim;
    }

    public Doktor getDoktor() {
        return doktor;
    }

    public void setDoktor(Doktor doktor) {
        this.doktor = doktor;
    }

    public LocalDateTime getTarih() {
        return tarih;
    }

    public void setTarih(LocalDateTime tarih) {
        this.tarih = tarih;
    }

    public String getDurum() {
        return durum;
    }

    public void setDurum(String durum) {
        this.durum = durum;
    }

    public String getOlusturan() {
        return olusturan;
    }

    public void setOlusturan(String olusturan) {
        this.olusturan = olusturan;
    }

    // --- GÜVENLİ TOSTRING METODU ---
    @Override
    public String toString() {
        return "HastaKayıt{" +
                "kayitID=" + kayitID +
                ", tarih=" + tarih +
                ", durum='" + durum + '\'' +
                ", olusturan='" + olusturan + '\'' +
                ", hastaID=" + (hasta != null ? hasta.getHastaID() : "null") +
                ", doktorID=" + (doktor != null ? doktor.getDoktorID() : "null") +
                '}';
    }
}