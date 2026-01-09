package com.example.hospital.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Tüm endpoint'lere izin ver
                .allowedOrigins("http://localhost:5173") // Sadece React uygulamasına izin ver
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // İzin verilen metodlar
                .allowedHeaders("*") // Tüm header'lara izin ver
                .allowCredentials(true);
    }
}