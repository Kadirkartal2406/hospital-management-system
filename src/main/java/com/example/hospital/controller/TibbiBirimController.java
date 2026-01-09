package com.example.hospital.controller;

import com.example.hospital.module.TibbiBirim;
import com.example.hospital.repository.TibbiBirimRepository;
import com.example.hospital.service.TibbiBirimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tibbiBirim")
public class TibbiBirimController {
    private TibbiBirimService tibbiBirimService;

    @Autowired
    public TibbiBirimController(TibbiBirimService tibbiBirimService) {
        this.tibbiBirimService = tibbiBirimService;
    }
    @GetMapping
    public List<TibbiBirim> findAll() {
        return tibbiBirimService.getAllTibbirim();
    }
    @GetMapping(path="{birimID}")
    public TibbiBirim getBirim(Long birimID){
        return tibbiBirimService.getBirim(birimID);
    }
    @PostMapping
    public ResponseEntity<String> addBirim(@RequestBody TibbiBirim tibbiBirim) {
        tibbiBirimService.add(tibbiBirim);
        return ResponseEntity.ok("birim added");
    }

    @DeleteMapping(path="{birimID}")
    public void deleteBirim(@PathVariable("birimID") Long birimID) {tibbiBirimService.delete(birimID);}

    @PutMapping(path = "{birimID}")
    public void updateTibbiBirim(@PathVariable("birimID") Long birimID, @RequestParam(required = false) String birimAdi) {tibbiBirimService.update(birimID, birimAdi);}


}
