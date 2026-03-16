
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

 public double totalCO2;

}
