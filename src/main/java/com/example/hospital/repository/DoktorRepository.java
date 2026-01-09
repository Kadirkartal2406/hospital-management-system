package com.example.hospital.repository;

import com.example.hospital.module.Doktor;
import com.example.hospital.module.TibbiBirim; // Bu import önemli
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoktorRepository extends JpaRepository<Doktor, Long> {

    boolean existsByAdSoyadAndTibbiBirim(String adSoyad, TibbiBirim tibbiBirim);

    // YENİ EKLENEN: Bir birimde kaç doktor olduğunu sayar
    int countByTibbiBirim(TibbiBirim tibbiBirim);
}