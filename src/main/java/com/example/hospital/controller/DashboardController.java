package com.example.hospital.controller;

import com.example.hospital.repository.DoktorRepository;
import com.example.hospital.repository.HastaKayitRepository;
import com.example.hospital.repository.HastaRepository;
import com.example.hospital.repository.TibbiBirimRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final HastaRepository hastaRepository;
    private final DoktorRepository doktorRepository;
    private final TibbiBirimRepository tibbiBirimRepository;
    private final HastaKayitRepository hastaKayitRepository;

    public DashboardController(HastaRepository hastaRepository, DoktorRepository doktorRepository, TibbiBirimRepository tibbiBirimRepository, HastaKayitRepository hastaKayitRepository) {
        this.hastaRepository = hastaRepository;
        this.doktorRepository = doktorRepository;
        this.tibbiBirimRepository = tibbiBirimRepository;
        this.hastaKayitRepository = hastaKayitRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();

        // Veritabanındaki gerçek sayıları sayıp döndürür
        stats.put("toplamHasta", hastaRepository.count());
        stats.put("toplamDoktor", doktorRepository.count());
        stats.put("toplamBirim", tibbiBirimRepository.count());
        stats.put("toplamRandevu", hastaKayitRepository.count());

        return stats;
    }
}