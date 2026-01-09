package com.example.hospital.controller;

import com.example.hospital.module.Hasta;
import com.example.hospital.service.HastaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hasta")
public class HastaController {

    private final HastaService hastaService;

    public HastaController(HastaService hastaService) {
        this.hastaService = hastaService;
    }

    @GetMapping
    public List<Hasta> getAll() {
        // HATA BURADAYDI: eski kodda 'getHasta()' yazıyordu, doğrusu 'getAll()'
        return hastaService.getAll();
    }

    @GetMapping("/{id}")
    public Hasta getOne(@PathVariable Long id) {
        return hastaService.getOneHasta(id);
    }

    @PostMapping
    public Hasta add(@RequestBody Hasta hasta) {
        return hastaService.add(hasta);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody Hasta hasta) {
        hastaService.update(id, hasta);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        hastaService.deleteHasta(id);
    }
}