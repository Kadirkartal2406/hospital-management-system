package com.example.hospital.service;

import com.example.hospital.module.Doktor;
import com.example.hospital.module.Hasta;
import com.example.hospital.module.HastaKayit;
import com.example.hospital.module.TibbiBirim;
import com.example.hospital.repository.DoktorRepository;
import com.example.hospital.repository.HastaKayitRepository;
import com.example.hospital.repository.HastaRepository;
import com.example.hospital.repository.TibbiBirimRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HastaKayitService {
    private final HastaKayitRepository hastaKayitRepository;
    private final HastaRepository hastaRepository;
    private final DoktorRepository doktorRepository;
    private final TibbiBirimRepository tibbiBirimRepository;

    @Autowired
    public HastaKayitService(HastaKayitRepository hastaKayitRepository, HastaRepository hastaRepository, DoktorRepository doktorRepository, TibbiBirimRepository tibbiBirimRepository) {
        this.hastaKayitRepository = hastaKayitRepository;
        this.hastaRepository = hastaRepository;
        this.doktorRepository = doktorRepository;
        this.tibbiBirimRepository = tibbiBirimRepository;
    }

    public List<HastaKayit> getAll() {
        return hastaKayitRepository.findAll();
    }

    public HastaKayit getOneHastaKayit(Long hastaKayitID) {
        return hastaKayitRepository.findById(hastaKayitID).orElse(null);
    }

    public void deleteKayit(Long kayitID) {
        boolean exists = hastaKayitRepository.existsById(kayitID);
        if (!exists) {
            throw new IllegalStateException("HastaKayit id: " + kayitID + " does not exist");
        }
        hastaKayitRepository.deleteById(kayitID);
    }

    // --- DÜZELTİLEN ADD METODU (ARTIK NESNE DÖNDÜRÜYOR) ---
    public HastaKayit add(HastaKayit hastaKayit) {
        LocalDateTime randevuZamani = hastaKayit.getTarih();
        Long doktorID = hastaKayit.getDoktor().getDoktorID();

        // --- YENİ: ÇAKIŞMA KONTROLÜ (Bu doktorun o saatte randevusu var mı?) ---
        boolean randevuDoluMu = hastaKayitRepository.existsByDoktor_DoktorIDAndTarih(doktorID, randevuZamani);

        if (randevuDoluMu) {
            throw new IllegalArgumentException("Seçilen saatte doktorun başka bir randevusu mevcut! Lütfen başka bir saat seçiniz.");
        }

        // KURAL 0: Tarih boş olamaz
        if (randevuZamani == null) {
            throw new IllegalArgumentException("Lütfen bir tarih seçiniz!");
        }

        // KURAL 1: GEÇMİŞ ZAMANA RANDEVU ALINAMAZ
        if (randevuZamani.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Geçmiş bir tarihe randevu alamazsınız!");
        }

        // KURAL 2: MESAİ SAATLERİ (08:00-12:00 ve 13:00-17:00)
        int saat = randevuZamani.getHour();
        // 08:00 - 11:59 ARASI (Sabah)  VEYA  13:00 - 16:59 ARASI (Öğleden Sonra)
        boolean sabahMesaisi = (saat >= 8 && saat < 12);
        boolean ogleMesaisi = (saat >= 13 && saat < 17);

        if (!sabahMesaisi && !ogleMesaisi) {
            throw new IllegalArgumentException("Randevular sadece 08:00-12:00 ve 13:00-17:00 saatleri arasında alınabilir.");
        }

        // KURAL 3: 15 DAKİKALIK PERİYOTLAR (00, 15, 30, 45)
        int dakika = randevuZamani.getMinute();
        if (dakika % 15 != 0) {
            throw new IllegalArgumentException("Randevu saatleri 15 dakikalık aralıklarla olmalıdır (Örn: 09:00, 09:15, 09:30).");
        }

        // KURAL 4: DOKTORUN O SAATTE BAŞKA RANDEVUSU VAR MI? (Çakışma Kontrolü)
        // Bu ekstra bir özellik ama çok gereklidir. Basitçe ekleyelim:
        // (Bunun için Repository'e metod eklemek gerekir, şimdilik basit tutup geçiyoruz ama aklında olsun)

        // --- DİĞER KONTROLLER (Hasta, Doktor, Birim null mu?) ---
        if (hastaKayit.getHasta() == null || hastaKayit.getHasta().getHastaID() == null) {
            throw new IllegalArgumentException("Hasta bilgisi eksik!");
        }
        Optional<Hasta> hastaOptional = hastaRepository.findById(hastaKayit.getHasta().getHastaID());

        if (hastaKayit.getDoktor() == null || hastaKayit.getDoktor().getDoktorID() == null) {
            throw new IllegalArgumentException("Doktor seçimi yapılmadı!");
        }
        Optional<Doktor> doktorOptional = doktorRepository.findById(hastaKayit.getDoktor().getDoktorID());

        if (hastaKayit.getTibbiBirim() == null || hastaKayit.getTibbiBirim().getBirimID() == null) {
            throw new IllegalArgumentException("Tıbbi Birim seçimi yapılmadı!");
        }
        Optional<TibbiBirim> tibbiBirimOptional = tibbiBirimRepository.findById(hastaKayit.getTibbiBirim().getBirimID());

        // Veritabanından gelen nesneleri set et
        hastaKayit.setHasta(hastaOptional.get());
        hastaKayit.setDoktor(doktorOptional.get());
        hastaKayit.setTibbiBirim(tibbiBirimOptional.get());

        return hastaKayitRepository.save(hastaKayit);
    }

    @Transactional
    public void update(Long id, HastaKayit updatedHastaKayit) {
        HastaKayit existingHastaKayit = hastaKayitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("HastaKayit bulunamadı ID: " + id));

        if (updatedHastaKayit.getTarih() != null) {
            existingHastaKayit.setTarih(updatedHastaKayit.getTarih());
        }
        if (updatedHastaKayit.getHasta() != null && updatedHastaKayit.getHasta().getHastaID() != null) {
            Hasta hasta = hastaRepository.findById(updatedHastaKayit.getHasta().getHastaID())
                    .orElseThrow(() -> new IllegalArgumentException("Hasta bulunamadı"));
            existingHastaKayit.setHasta(hasta);
        }
        if (updatedHastaKayit.getDoktor() != null && updatedHastaKayit.getDoktor().getDoktorID() != null) {
            Doktor doktor = doktorRepository.findById(updatedHastaKayit.getDoktor().getDoktorID())
                    .orElseThrow(() -> new IllegalArgumentException("Doktor bulunamadı"));
            existingHastaKayit.setDoktor(doktor);
        }
        if (updatedHastaKayit.getTibbiBirim() != null && updatedHastaKayit.getTibbiBirim().getBirimID() != null) {
            TibbiBirim birim = tibbiBirimRepository.findById(updatedHastaKayit.getTibbiBirim().getBirimID())
                    .orElseThrow(() -> new IllegalArgumentException("Birim bulunamadı"));
            existingHastaKayit.setTibbiBirim(birim);
        }
        if (updatedHastaKayit.getDurum() != null) {
            existingHastaKayit.setDurum(updatedHastaKayit.getDurum());
        }

        hastaKayitRepository.save(existingHastaKayit);
    }
}