package com.example.hospital.module;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // Eklendi

@Entity
public class Kullanici {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String kullaniciAdi;
    private String sifre;
    private String rol; // "ADMIN" veya "USER"

    // --- YENİ İLİŞKİ: Her Kullanıcının bir Hasta kaydı olabilir ---
    @OneToOne(cascade = CascadeType.ALL) // Kullanıcı silinirse hastayı da siler (İsteğe bağlı)
    @JoinColumn(name = "hasta_id", referencedColumnName = "hastaID")
    private Hasta hasta;

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getKullaniciAdi() { return kullaniciAdi; }
    public void setKullaniciAdi(String kullaniciAdi) { this.kullaniciAdi = kullaniciAdi; }
    public String getSifre() { return sifre; }
    public void setSifre(String sifre) { this.sifre = sifre; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public Hasta getHasta() { return hasta; }
    public void setHasta(Hasta hasta) { this.hasta = hasta; }
}