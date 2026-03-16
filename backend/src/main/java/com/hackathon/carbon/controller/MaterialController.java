package com.hackathon.carbon.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hackathon.carbon.model.Material;
import com.hackathon.carbon.model.Site;
import com.hackathon.carbon.repository.MaterialRepository;
import com.hackathon.carbon.repository.SiteRepository;
import com.hackathon.carbon.repository.CarbonResultRepository;
import com.hackathon.carbon.model.CarbonResult;

@RestController
@CrossOrigin(origins = {
 "http://localhost:4200",
 "http://127.0.0.1:4200",
 "http://172.20.10.2:4200"
})
@RequestMapping("/api/sites/{siteId}/materials")
public class MaterialController {

 private final MaterialRepository materialRepo;
 private final SiteRepository siteRepo;

 public MaterialController(MaterialRepository materialRepo, SiteRepository siteRepo) {
  this.materialRepo = materialRepo;
  this.siteRepo = siteRepo;
 }

 @GetMapping
 public ResponseEntity<List<Material>> getMaterials(@PathVariable Long siteId) {
  Optional<Site> site = siteRepo.findById(siteId);
  if (site.isEmpty()) {
   return ResponseEntity.notFound().build();
  }
  List<Material> materials = materialRepo.findBySite(site.get());
  return ResponseEntity.ok(materials);
 }

 @PostMapping
 public ResponseEntity<Material> addMaterial(@PathVariable Long siteId, @RequestBody Material material) {
  Optional<Site> site = siteRepo.findById(siteId);
  if (site.isEmpty()) {
   return ResponseEntity.notFound().build();
  }
  material.site = site.get();
  return ResponseEntity.ok(materialRepo.save(material));
 }

 @DeleteMapping("/{materialId}")
 public ResponseEntity<Void> deleteMaterial(@PathVariable Long siteId, @PathVariable Long materialId) {
  Optional<Material> material = materialRepo.findById(materialId);
  if (material.isEmpty() || !material.get().site.id.equals(siteId)) {
   return ResponseEntity.notFound().build();
  }
  materialRepo.deleteById(materialId);
  return ResponseEntity.noContent().build();
 }
}
