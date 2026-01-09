package com.example.hospital.config;

import com.example.hospital.module.Doktor;
import com.example.hospital.module.Kullanici;
import com.example.hospital.module.TibbiBirim;
import com.example.hospital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TibbiBirimRepository tibbiBirimRepository;
    private final DoktorRepository doktorRepository;
    private final KullaniciRepository kullaniciRepository;

    private final List<String> adlar = Arrays.asList("Ahmet", "Mehmet", "Ayşe", "Fatma", "Mustafa", "Zeynep", "Emre", "Elif", "Can", "Burak");
    private final List<String> soyadlar = Arrays.asList("Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Öztürk", "Aydın", "Arslan", "Doğan");

    public DataInitializer(TibbiBirimRepository tibbiBirimRepository,
                           DoktorRepository doktorRepository,
                           KullaniciRepository kullaniciRepository) {
        this.tibbiBirimRepository = tibbiBirimRepository;
        this.doktorRepository = doktorRepository;
        this.kullaniciRepository = kullaniciRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Sistem Kontrol Ediliyor... ---");

        // ARTIK SİLME İŞLEMİ YOK (deleteAll kaldırıldı)

        // 1. ADMIN KONTROLÜ (Yoksa Ekle)
        if (kullaniciRepository.findByKullaniciAdi("admin").isEmpty()) {
            Kullanici admin = new Kullanici();
            admin.setKullaniciAdi("admin");
            admin.setSifre("12345");
            admin.setRol("ADMIN");
            kullaniciRepository.save(admin);
            System.out.println("-> Admin kullanıcısı oluşturuldu.");
        }

        // 2. BİRİMLER VE DOKTORLAR (Yoksa Ekle)
        List<String> birimIsimleri = Arrays.asList(
                "Acil Servis", "Dahiliye", "Kardiyoloji", "Nöroloji",
                "Ortopedi", "Pediatri", "Kadın Doğum", "Genel Cerrahi",
                "Göz", "KBB", "Cildiye", "Üroloji", "Psikiyatri"
        );

        Random random = new Random();

        for (String isim : birimIsimleri) {
            TibbiBirim birim;
            Optional<TibbiBirim> mevcutBirim = tibbiBirimRepository.findByBirimAdi(isim);

            if (mevcutBirim.isPresent()) {
                birim = mevcutBirim.get();
            } else {
                birim = new TibbiBirim();
                birim.setBirimAdi(isim);
                birim = tibbiBirimRepository.save(birim);
            }

            // Eğer o birimde hiç doktor yoksa 2 tane ekle
            if (doktorRepository.countByTibbiBirim(birim) == 0) {
                for (int i = 0; i < 2; i++) {
                    String tamAd = "Dr. " + adlar.get(random.nextInt(adlar.size())) + " " + soyadlar.get(random.nextInt(soyadlar.size()));
                    Doktor doktor = new Doktor();
                    doktor.setAdSoyad(tamAd);
                    doktor.setUzmanlik(isim + " Uzmanı");
                    doktor.setTibbiBirim(birim);
                    doktorRepository.save(doktor);
                }
                System.out.println("-> " + isim + " için doktorlar eklendi.");
            }
        }
        System.out.println("--- Sistem Hazır (Veriler Korundu) ---");
    }
}