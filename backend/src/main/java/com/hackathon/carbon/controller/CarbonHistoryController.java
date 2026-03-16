package com.hackathon.carbon.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hackathon.carbon.model.CarbonResult;
import com.hackathon.carbon.model.Site;
import com.hackathon.carbon.repository.CarbonResultRepository;
import com.hackathon.carbon.repository.SiteRepository;

@RestController
@CrossOrigin(origins = {
 "http://localhost:4200",
 "http://127.0.0.1:4200",
 "http://172.20.10.2:4200"
})
@RequestMapping("/api/sites/{siteId}/history")
public class CarbonHistoryController {

 private final CarbonResultRepository carbonResultRepo;
 private final SiteRepository siteRepo;

 public CarbonHistoryController(CarbonResultRepository carbonResultRepo, SiteRepository siteRepo) {
  this.carbonResultRepo = carbonResultRepo;
  this.siteRepo = siteRepo;
 }

 @GetMapping
 public ResponseEntity<List<CarbonResult>> getCarbonHistory(@PathVariable Long siteId) {
  Optional<Site> site = siteRepo.findById(siteId);
  if (site.isEmpty()) {
   return ResponseEntity.notFound().build();
  }
  List<CarbonResult> history = carbonResultRepo.findBySiteOrderByCreatedAtDesc(site.get());
  return ResponseEntity.ok(history);
 }

 @PostMapping
 public ResponseEntity<CarbonResult> saveCarbonResult(@PathVariable Long siteId, @RequestBody CarbonResult result) {
  Optional<Site> site = siteRepo.findById(siteId);
  if (site.isEmpty()) {
   return ResponseEntity.notFound().build();
  }
  result.site = site.get();
  return ResponseEntity.ok(carbonResultRepo.save(result));
 }
}
