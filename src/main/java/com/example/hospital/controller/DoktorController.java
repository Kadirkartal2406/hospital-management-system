package com.example.hospital.controller;

import com.example.hospital.module.Doktor;
import com.example.hospital.repository.DoktorRepository;
import com.example.hospital.service.DoktorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(path="/api/doktor")
public class DoktorController {
    private final DoktorService doktorService;
    @Autowired
    public DoktorController(DoktorService doktorService) {
        this.doktorService = doktorService;
    }
    @GetMapping
    public List<Doktor> getAllDoktor() {return doktorService.getAll();}
    @GetMapping(path="/{doktorID}")
    public Doktor getOneDoktor(@PathVariable Long doktorID){
        return doktorService.getOneDoktor(doktorID);
    }
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Doktor> addDoktor(@RequestBody Doktor doktor) {
        doktorService.add(doktor);
        return ResponseEntity.status(HttpStatus.CREATED).body(doktor);    }

    @DeleteMapping(path="/{doktorID}")
    public void deleteDoktor(@PathVariable ("doktorID") Long doktorID) {
       doktorService.delete(doktorID);
    }@PutMapping(path = "/{doktorID}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void updateDoktor(
            @PathVariable Long doktorID,
            @RequestBody Doktor doktor
    ) {
        doktorService.update(doktorID, doktor);
    }


}
