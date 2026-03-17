
package com.hackathon.carbon.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hackathon.carbon.model.Site;
import com.hackathon.carbon.repository.SiteRepository;
import com.hackathon.carbon.service.CarbonService;

@RestController
@CrossOrigin(origins = {
 "http://localhost:4200",
 "http://127.0.0.1:4200",
 "http://172.20.10.2:4200"
})
@RequestMapping("/api/sites")
public class SiteController {

 private final SiteRepository repo;
 private final CarbonService service;

 public SiteController(SiteRepository repo,CarbonService service){
  this.repo=repo;
  this.service=service;
 }

 @PostMapping
 public Site create(@RequestBody Site site){

    site.constructionCO2 = service.calculateConstruction(site);

    site.operationCO2 = service.calculateOperation(site);

  site.totalCO2 = service.calculate(site);

  return repo.save(site);

 }

 @GetMapping
 public List<Site> all(){
  List<Site> sites = repo.findAll();

  for (Site site : sites) {
   site.operationCO2 = service.calculateOperation(site);
   site.constructionCO2 = Math.max(0, site.totalCO2 - site.operationCO2);
  }

  return sites;
 }

 @GetMapping("/{id}")
 public ResponseEntity<Site> getById(@PathVariable Long id) {
  Optional<Site> site = repo.findById(id);
  if (site.isEmpty()) {
   return ResponseEntity.notFound().build();
  }

  Site s = site.get();
  s.operationCO2 = service.calculateOperation(s);
  s.constructionCO2 = Math.max(0, s.totalCO2 - s.operationCO2);

  return ResponseEntity.ok(s);
 }

 @PutMapping("/{id}")
 public ResponseEntity<Site> update(@PathVariable Long id, @RequestBody Site siteDetails) {
  Optional<Site> site = repo.findById(id);
  if (site.isEmpty()) {
   return ResponseEntity.notFound().build();
  }

  Site s = site.get();
  s.name = siteDetails.name;
  s.surface = siteDetails.surface;
  s.parkingSpaces = siteDetails.parkingSpaces;
  s.energyMWh = siteDetails.energyMWh;
  s.employees = siteDetails.employees;
  s.concreteTons = siteDetails.concreteTons;
  s.steelTons = siteDetails.steelTons;
  s.glassTons = siteDetails.glassTons;

  s.constructionCO2 = service.calculateConstruction(s);
  s.operationCO2 = service.calculateOperation(s);
  s.totalCO2 = service.calculate(s);

  return ResponseEntity.ok(repo.save(s));
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> delete(@PathVariable Long id) {
  if (!repo.existsById(id)) {
   return ResponseEntity.notFound().build();
  }
  repo.deleteById(id);
  return ResponseEntity.noContent().build();
 }

 @GetMapping("/{id}/carbon")
 public ResponseEntity<?> getCarbonData(@PathVariable Long id) {
  Optional<Site> site = repo.findById(id);
  if (site.isEmpty()) {
   return ResponseEntity.notFound().build();
  }

  Site s = site.get();
  s.operationCO2 = service.calculateOperation(s);
  s.constructionCO2 = Math.max(0, s.totalCO2 - s.operationCO2);

  java.util.Map<String, Object> carbonData = new java.util.HashMap<>();
  carbonData.put("siteId", s.id);
  carbonData.put("siteName", s.name);
  carbonData.put("totalCO2", s.totalCO2);
  carbonData.put("constructionCO2", s.constructionCO2);
  carbonData.put("operationCO2", s.operationCO2);
  carbonData.put("co2PerSqm", s.surface > 0 ? s.totalCO2 / s.surface : 0);
  carbonData.put("co2PerEmployee", s.employees > 0 ? s.totalCO2 / s.employees : 0);

  return ResponseEntity.ok(carbonData);
 }

}
