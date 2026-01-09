package com.example.hospital.controller;

import com.example.hospital.module.Hasta;
import com.example.hospital.module.Kullanici;
import com.example.hospital.repository.HastaRepository;
import com.example.hospital.repository.KullaniciRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final KullaniciRepository kullaniciRepository;
    private final HastaRepository hastaRepository; // Hasta kaydı da yapacağız

    public AuthController(KullaniciRepository kullaniciRepository, HastaRepository hastaRepository) {
        this.kullaniciRepository = kullaniciRepository;
        this.hastaRepository = hastaRepository;
    }

    // --- YENİ: KAYIT OL (REGISTER) ---
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {
        try {
            String adSoyad = body.get("adSoyad");
            String tcNo = body.get("tcNo");
            String sifre = body.get("sifre");
            String dogumTarihiStr = body.get("dogumTarihi"); // Örn: "2000-05-20"
            String hastalik = body.get("hastalik");

            // 1. TC KONTROLÜ
            if (kullaniciRepository.findByKullaniciAdi(tcNo).isPresent()) {
                throw new RuntimeException("Bu TC Kimlik No (" + tcNo + ") zaten sistemde kayıtlı!");
            }

            // 2. TARİH FORMATI KONTROLÜ
            java.time.LocalDate dogumTarihi;
            try {
                dogumTarihi = java.time.LocalDate.parse(dogumTarihiStr);
            } catch (Exception e) {
                throw new RuntimeException("Tarih formatı hatalı! Beklenen: YYYY-MM-DD. Gelen: " + dogumTarihiStr);
            }

            // 3. HASTA OLUŞTUR
            Hasta yeniHasta = new Hasta();
            yeniHasta.setAdSoyad(adSoyad);
            yeniHasta.setDogumTarihi(dogumTarihi);
            yeniHasta.setHastalik(hastalik != null ? hastalik : "Belirtilmedi");
            yeniHasta = hastaRepository.save(yeniHasta);

            // 4. KULLANICI OLUŞTUR
            Kullanici yeniKullanici = new Kullanici();
            yeniKullanici.setKullaniciAdi(tcNo);
            yeniKullanici.setSifre(sifre);
            yeniKullanici.setRol("USER");
            yeniKullanici.setHasta(yeniHasta);

            kullaniciRepository.save(yeniKullanici);

            return Map.of("status", "success", "message", "Kayıt başarılı!");

        } catch (Exception e) {
            // Hatayı konsola yazdır ki biz de görelim
            e.printStackTrace();
            // Frontend'e hatayı fırlat (Spring otomatik olarak 500 döner ve mesajı iletir)
            throw new RuntimeException(e.getMessage());
        }
    }

    // --- GÜNCELLENEN: GİRİŞ YAP (LOGIN) ---
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Kullanici girisBilgisi) {
        Optional<Kullanici> kullanici = kullaniciRepository.findByKullaniciAdi(girisBilgisi.getKullaniciAdi());

        if (kullanici.isPresent() && kullanici.get().getSifre().equals(girisBilgisi.getSifre())) {

            // Eğer kullanıcı bir hastaya bağlıysa ID'sini al, yoksa null (Admin vb.)
            Long hastaId = (kullanici.get().getHasta() != null) ? kullanici.get().getHasta().getHastaID() : null;

            return Map.of(
                    "status", "success",
                    "role", kullanici.get().getRol(),
                    "username", kullanici.get().getKullaniciAdi(),
                    "hastaId", hastaId != null ? hastaId : 0 // Hasta ID'sini de gönderiyoruz
            );
        } else {
            throw new RuntimeException("Kullanıcı adı veya şifre hatalı!");
        }
    }
    // --- YENİ: PROFİL GÜNCELLEME ---
    @PutMapping("/update/{hastaId}")
    public Map<String, String> updateProfile(@PathVariable Long hastaId, @RequestBody Map<String, String> body) {
        String yeniAdSoyad = body.get("adSoyad");
        String yeniSifre = body.get("sifre");
        String yeniHastalik = body.get("hastalik");

        // 1. Kullanıcıyı Bul (Şifre değişimi için)
        Optional<Kullanici> userOpt = kullaniciRepository.findByHasta_HastaID(hastaId);
        if (userOpt.isPresent()) {
            Kullanici user = userOpt.get();
            if (yeniSifre != null && !yeniSifre.isEmpty()) {
                user.setSifre(yeniSifre);
            }
            kullaniciRepository.save(user);
        }

        // 2. Hastayı Bul (Ad ve Hastalık değişimi için)
        Optional<Hasta> hastaOpt = hastaRepository.findById(hastaId);
        if (hastaOpt.isPresent()) {
            Hasta hasta = hastaOpt.get();
            if (yeniAdSoyad != null && !yeniAdSoyad.isEmpty()) hasta.setAdSoyad(yeniAdSoyad);
            if (yeniHastalik != null) hasta.setHastalik(yeniHastalik);
            hastaRepository.save(hasta);

            return Map.of("status", "success", "message", "Profil güncellendi!");
        } else {
            throw new RuntimeException("Kullanıcı bulunamadı!");
        }
    }
}