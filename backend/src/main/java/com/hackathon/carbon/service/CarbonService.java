
package com.hackathon.carbon.service;

import org.springframework.stereotype.Service;
import com.hackathon.carbon.model.Site;

@Service
public class CarbonService {

 public double calculate(Site site){

  double energyKwh = site.energyMWh * 1000;

  double energyCO2 = energyKwh * 0.05;

  double construction = site.surface * 50;

  return energyCO2 + construction;

 }

}
