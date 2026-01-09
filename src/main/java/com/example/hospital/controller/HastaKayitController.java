package com.example.hospital.controller;

import com.example.hospital.module.HastaKayit;
import com.example.hospital.service.HastaKayitService;
import com.example.hospital.repository.HastaKayitRepository; // Repository'i direkt burada kullanacağız pratiklik için
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hastaKayit")
public class HastaKayitController {

    private final HastaKayitService service;
    private final HastaKayitRepository repository;

    public HastaKayitController(HastaKayitService service, HastaKayitRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    // --- GÜNCELLENEN GET METODU ---
    // Frontend'den 'role' ve 'username' parametrelerini bekliyoruz
    @GetMapping
    public List<HastaKayit> getAll(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String username
    ) {
        // Eğer role belirtilmemişse veya ADMIN ise hepsini getir
        if (role == null || role.equals("ADMIN")) {
            return service.getAll();
        }
        // Eğer USER ise sadece kendi oluşturduklarını getir
        else if (role.equals("USER") && username != null) {
            return repository.findByOlusturan(username);
        }

        return List.of(); // Güvenlik önlemi: Boş liste dön
    }

    @GetMapping("/{id}")
    public HastaKayit getOne(@PathVariable Long id) {
        return service.getOneHastaKayit(id);
    }

    @PostMapping
    public HastaKayit add(@RequestBody HastaKayit hastaKayit) {
        return service.add(hastaKayit);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody HastaKayit hastaKayit) {
        service.update(id, hastaKayit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteKayit(id);
    }
}