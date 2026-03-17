
package com.hackathon.carbon.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
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

 @GetMapping("/compare")
 public ResponseEntity<?> compareSites(@RequestParam Long siteAId, @RequestParam Long siteBId) {
  Optional<Site> siteAOptional = repo.findById(siteAId);
  Optional<Site> siteBOptional = repo.findById(siteBId);

  if (siteAOptional.isEmpty() || siteBOptional.isEmpty()) {
   return ResponseEntity.notFound().build();
  }

  Site siteA = siteAOptional.get();
  Site siteB = siteBOptional.get();

  siteA.operationCO2 = service.calculateOperation(siteA);
  siteA.constructionCO2 = Math.max(0, siteA.totalCO2 - siteA.operationCO2);

  siteB.operationCO2 = service.calculateOperation(siteB);
  siteB.constructionCO2 = Math.max(0, siteB.totalCO2 - siteB.operationCO2);

  Map<String, Object> metricsA = buildMetrics(siteA);
  Map<String, Object> metricsB = buildMetrics(siteB);

  Map<String, Object> differences = new HashMap<>();
  differences.put("totalCO2", ((double) metricsA.get("totalCO2")) - ((double) metricsB.get("totalCO2")));
  differences.put("constructionCO2", ((double) metricsA.get("constructionCO2")) - ((double) metricsB.get("constructionCO2")));
  differences.put("operationCO2", ((double) metricsA.get("operationCO2")) - ((double) metricsB.get("operationCO2")));
  differences.put("co2PerSqm", ((double) metricsA.get("co2PerSqm")) - ((double) metricsB.get("co2PerSqm")));
  differences.put("co2PerEmployee", ((double) metricsA.get("co2PerEmployee")) - ((double) metricsB.get("co2PerEmployee")));

  Map<String, Object> response = new HashMap<>();
  response.put("siteA", metricsA);
  response.put("siteB", metricsB);
  response.put("differences", differences);

  return ResponseEntity.ok(response);
 }

 private Map<String, Object> buildMetrics(Site site) {
  Map<String, Object> metrics = new HashMap<>();
  metrics.put("siteId", site.id);
  metrics.put("siteName", site.name);
  metrics.put("totalCO2", site.totalCO2);
  metrics.put("constructionCO2", site.constructionCO2);
  metrics.put("operationCO2", site.operationCO2);
  metrics.put("co2PerSqm", site.surface > 0 ? site.totalCO2 / site.surface : 0);
  metrics.put("co2PerEmployee", site.employees > 0 ? site.totalCO2 / site.employees : 0);
  return metrics;
 }

}
