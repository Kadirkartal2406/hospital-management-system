package com.example.hospital.repository;

import com.example.hospital.module.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KullaniciRepository extends JpaRepository<Kullanici, Long> {
    Optional<Kullanici> findByKullaniciAdi(String kullaniciAdi);

    // YENİ: Hasta ID'sine göre kullanıcıyı bulur
    Optional<Kullanici> findByHasta_HastaID(Long hastaID);
}