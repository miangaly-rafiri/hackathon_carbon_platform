
package com.hackathon.carbon.controller;

import java.util.List;

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

}
