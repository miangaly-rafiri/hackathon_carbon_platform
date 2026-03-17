package com.hackathon.carbon.model;

import jakarta.persistence.*;

@Entity
@Table(name = "materials")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "site_id", nullable = false)
    public Site site;

    @Column(nullable = false)
    public String type; // béton, acier, verre, bois

    @Column(nullable = false)
    public double quantity; // en tonnes

    public Material() {}

    public Material(Site site, String type, double quantity) {
        this.site = site;
        this.type = type;
        this.quantity = quantity;
    }
}
