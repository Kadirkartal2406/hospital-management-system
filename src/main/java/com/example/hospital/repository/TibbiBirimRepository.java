package com.example.hospital.repository;

import com.example.hospital.module.TibbiBirim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TibbiBirimRepository extends JpaRepository<TibbiBirim, Long> {

    // Zaten var mı kontrolü için (true/false döner)
    boolean existsByBirimAdi(String birimAdi);

    // Birimi ismine göre bulup getirmek için (Hata veren kısım burasıydı)
    Optional<TibbiBirim> findByBirimAdi(String birimAdi);
}