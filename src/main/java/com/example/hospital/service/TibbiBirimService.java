package com.example.hospital.service;

import com.example.hospital.module.TibbiBirim;
import com.example.hospital.repository.TibbiBirimRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TibbiBirimService {
    private final TibbiBirimRepository tibbiBirimRepository;

    @Autowired
    public TibbiBirimService(TibbiBirimRepository tibbiBirimRepository) {
        this.tibbiBirimRepository = tibbiBirimRepository;
    }

    public List<TibbiBirim> getAllTibbirim() {
        return tibbiBirimRepository.findAll();
    }

    public TibbiBirim getBirim(Long birimID){
        return tibbiBirimRepository.findById(birimID).orElse(null);
    }

    // --- DÜZELTİLEN ADD METODU ---
    public void add(TibbiBirim tibbiBirim) {
        if (tibbiBirim.getBirimAdi() == null || tibbiBirim.getBirimAdi().trim().isEmpty()) {
            throw new IllegalArgumentException("Birim adı boş olamaz!");
        }

        // Eğer veritabanında bu isimde birim zaten varsa hata fırlat
        if (tibbiBirimRepository.existsByBirimAdi(tibbiBirim.getBirimAdi())) {
            throw new IllegalArgumentException("Bu isimde bir birim zaten mevcut!");
        }

        tibbiBirimRepository.save(tibbiBirim);
    }

    public void delete(Long birimID) {
        boolean exists = tibbiBirimRepository.existsById(birimID);
        if(!exists) {
            throw new IllegalArgumentException("Tibbirim bulunamadı, silinemedi.");
        }
        tibbiBirimRepository.deleteById(birimID);
    }

    @Transactional
    public void update(Long birimID, String birimAdi) {
        TibbiBirim tibbiBirim = tibbiBirimRepository.findById(birimID)
                .orElseThrow(() -> new IllegalStateException("Tibbirim ID: " + birimID + " bulunamadı"));

        // Burası gayet güzel yazılmış, null ve boşluk kontrolü var
        if(birimAdi != null && !birimAdi.isEmpty() && !Objects.equals(tibbiBirim.getBirimAdi(), birimAdi)) {
            tibbiBirim.setBirimAdi(birimAdi);
        }
    }
}