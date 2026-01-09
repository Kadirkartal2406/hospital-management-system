package com.example.hospital.repository;

import com.example.hospital.module.Hasta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HastaRepository extends JpaRepository<Hasta, Long> {

}
