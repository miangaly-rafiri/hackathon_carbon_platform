
package com.hackathon.carbon.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.hackathon.carbon.model.Site;
import com.hackathon.carbon.repository.SiteRepository;
import com.hackathon.carbon.service.CarbonService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
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

  site.totalCO2 = service.calculate(site);

  return repo.save(site);

 }

 @GetMapping
 public List<Site> all(){
  return repo.findAll();
 }

}
