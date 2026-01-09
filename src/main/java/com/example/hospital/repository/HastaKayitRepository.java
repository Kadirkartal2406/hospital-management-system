package com.example.hospital.repository;

import com.example.hospital.module.HastaKayit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface HastaKayitRepository extends JpaRepository<HastaKayit, Long> {

    // Hasta ID'sine göre bulma (Eski metodun)
    List<HastaKayit> findByHasta_HastaID(Long hastaID);

    // --- EKSİK OLAN KISIM BURASIYDI, BUNU EKLE: ---
    // Kullanıcı adına (TC) göre randevuları getiren metod
    List<HastaKayit> findByOlusturan(String olusturan);
    // ----------------------------------------------

    // Çakışma kontrolü için eklediğimiz metod
    boolean existsByDoktor_DoktorIDAndTarih(Long doktorID, LocalDateTime tarih);
}