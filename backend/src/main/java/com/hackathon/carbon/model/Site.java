
package com.hackathon.carbon.model;

import jakarta.persistence.*;

@Entity
public class Site {

 @Id
 @GeneratedValue
 public Long id;

 public String name;

 public double surface;

 public int parkingSpaces;

 public double energyMWh;

 public int employees;

 @Transient
 public double concreteTons;

 @Transient
 public double steelTons;

 @Transient
 public double glassTons;

 @Transient
 public double woodTons;

 @Transient
 public double constructionCO2;

 @Transient
 public double operationCO2;

 public double totalCO2;

}
