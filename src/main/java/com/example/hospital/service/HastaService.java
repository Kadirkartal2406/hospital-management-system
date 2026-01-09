package com.example.hospital.service;

import com.example.hospital.module.Hasta;
import com.example.hospital.repository.HastaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HastaService {
    private final HastaRepository hastaRepository;

    public HastaService(HastaRepository hastaRepository) {
        this.hastaRepository = hastaRepository;
    }

    public List<Hasta> getAll() {
        return hastaRepository.findAll();
    }

    public Hasta getOneHasta(Long hastaID) {
        return hastaRepository.findById(hastaID).orElse(null);
    }

    public Hasta add(Hasta hasta) {
        return hastaRepository.save(hasta);
    }

    public void deleteHasta(Long hastaID) {
        boolean exists = hastaRepository.existsById(hastaID);
        if (!exists) {
            throw new IllegalStateException("Hasta id " + hastaID + " bulunamadı");
        }
        hastaRepository.deleteById(hastaID);
    }

    public void update(Long id, Hasta updatedHasta) {
        Hasta existingHasta = hastaRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Hasta bulunamadı ID: " + id));

        // Ad Soyad Güncelle
        if (updatedHasta.getAdSoyad() != null && !updatedHasta.getAdSoyad().isEmpty()) {
            existingHasta.setAdSoyad(updatedHasta.getAdSoyad());
        }

        // --- GÜNCELLENEN KISIM: YAS YERİNE DOGUM TARİHİ ---
        if (updatedHasta.getDogumTarihi() != null) {
            existingHasta.setDogumTarihi(updatedHasta.getDogumTarihi());
        }

        // Hastalık Güncelle
        if (updatedHasta.getHastalik() != null && !updatedHasta.getHastalik().isEmpty()) {
            existingHasta.setHastalik(updatedHasta.getHastalik());
        }

        hastaRepository.save(existingHasta);
    }
}