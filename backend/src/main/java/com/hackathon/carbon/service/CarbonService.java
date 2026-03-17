
package com.hackathon.carbon.service;

import org.springframework.stereotype.Service;
import com.hackathon.carbon.model.Site;

@Service
public class CarbonService {

 private static final double ENERGY_CO2_FACTOR_KG_PER_KWH = 0.05;
 private static final double PARKING_CO2_FACTOR_KG_PER_SPACE = 1200;

 private static final double CONCRETE_CO2_FACTOR_KG_PER_TON = 100;
 private static final double STEEL_CO2_FACTOR_KG_PER_TON = 1700;
 private static final double GLASS_CO2_FACTOR_KG_PER_TON = 1200;
 private static final double WOOD_CO2_FACTOR_KG_PER_TON = 110;

 public double calculateConstruction(Site site) {

    double concrete = site.concreteTons * CONCRETE_CO2_FACTOR_KG_PER_TON;
    double steel = site.steelTons * STEEL_CO2_FACTOR_KG_PER_TON;
    double glass = site.glassTons * GLASS_CO2_FACTOR_KG_PER_TON;
    double wood = site.woodTons * WOOD_CO2_FACTOR_KG_PER_TON;
    double parking = site.parkingSpaces * PARKING_CO2_FACTOR_KG_PER_SPACE;

    return concrete + steel + glass + wood + parking;

 }

 public double calculateOperation(Site site) {

    double energyKwh = site.energyMWh * 1000;

    return energyKwh * ENERGY_CO2_FACTOR_KG_PER_KWH;

 }

 public double calculate(Site site){

    return calculateConstruction(site) + calculateOperation(site);

 }

}
