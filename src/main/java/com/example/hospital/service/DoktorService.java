package com.example.hospital.service;

import com.example.hospital.module.Doktor;
import com.example.hospital.module.TibbiBirim;
import com.example.hospital.repository.DoktorRepository;
import com.example.hospital.repository.TibbiBirimRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoktorService {
    private final DoktorRepository doktorRepository;
    private final TibbiBirimRepository tibbiBirimRepository;

    @Autowired
    public DoktorService(DoktorRepository doktorRepository, TibbiBirimRepository tibbiBirimRepository) {
        this.doktorRepository = doktorRepository;
        this.tibbiBirimRepository = tibbiBirimRepository;
    }

    public List<Doktor> getAll() {
        return doktorRepository.findAll();
    }

    public Doktor getOneDoktor(Long doktorID) {
        return doktorRepository.findById(doktorID).orElse(null);
    }

    // --- YENİ EKLENEN ADD METODU ---
    public void add(Doktor doktor) {
        // 1. Tıbbi Birim Seçilmiş mi?
        if (doktor.getTibbiBirim() == null || doktor.getTibbiBirim().getBirimID() == null) {
            throw new IllegalArgumentException("Doktor bir Tıbbi Birime atanmalıdır!");
        }

        // 2. Birimi Veritabanından Bul (Yoksa Hata Ver)
        Long birimID = doktor.getTibbiBirim().getBirimID();
        TibbiBirim birim = tibbiBirimRepository.findById(birimID)
                .orElseThrow(() -> new IllegalStateException("Seçilen Tıbbi Birim sistemde bulunamadı! ID: " + birimID));

        // 3. DUPLICATE KONTROLÜ (İstediğin Özellik)
        // Aynı isimde ve aynı birimde zaten kayıtlı bir doktor var mı?
        boolean kayitVarMi = doktorRepository.existsByAdSoyadAndTibbiBirim(doktor.getAdSoyad(), birim);
        if (kayitVarMi) {
            throw new IllegalArgumentException("Bu isimdeki doktor zaten bu birimde kayıtlı!");
        }

        // 4. İlişkiyi Kur ve Kaydet
        doktor.setTibbiBirim(birim);

        // Yeni kayıt olduğu için ID'si null olmalı (Hibernate kendi atar)
        // Eğer ID 0 veya null gelirse sorun yok, ama dolu gelirse sıfırlayalım ki üzerine yazmasın.
        if(doktor.getDoktorID() != null && doktor.getDoktorID() == 0){
            doktor.setDoktorID(null);
        }

        doktorRepository.save(doktor);
    }

    public void delete(Long doktorID) {
        boolean exists = doktorRepository.existsById(doktorID);
        if (!exists) {
            throw new IllegalArgumentException("Silinecek Doktor bulunamadı ID: " + doktorID);
        }
        doktorRepository.deleteById(doktorID);
    }

    // --- UPDATE METODU ---
    @Transactional
    public void update(Long doktorID, Doktor doktor) {
        Doktor existing = doktorRepository.findById(doktorID)
                .orElseThrow(() -> new IllegalArgumentException("Güncellenecek Doktor bulunamadı ID: " + doktorID));

        // İsim Güncelleme
        if (doktor.getAdSoyad() != null && !doktor.getAdSoyad().isEmpty()) {
            existing.setAdSoyad(doktor.getAdSoyad());
        }

        // Uzmanlık Güncelleme
        if (doktor.getUzmanlik() != null && !doktor.getUzmanlik().isEmpty()) {
            existing.setUzmanlik(doktor.getUzmanlik());
        }

        // Birim Güncelleme
        if (doktor.getTibbiBirim() != null && doktor.getTibbiBirim().getBirimID() != null) {
            TibbiBirim birim = tibbiBirimRepository.findById(doktor.getTibbiBirim().getBirimID())
                    .orElseThrow(() -> new IllegalArgumentException("Yeni Tıbbi Birim bulunamadı"));
            existing.setTibbiBirim(birim);
        }

        doktorRepository.save(existing);
    }
}