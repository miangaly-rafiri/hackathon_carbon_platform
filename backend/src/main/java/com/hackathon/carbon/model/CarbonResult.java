package com.hackathon.carbon.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_results")
public class CarbonResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "site_id", nullable = false)
    public Site site;

    @Column(nullable = false)
    public double totalCO2;

    @Column(nullable = false)
    public double constructionCO2;

    @Column(nullable = false)
    public double operationCO2;

    @Column(nullable = false)
    public LocalDateTime createdAt;

    public CarbonResult() {}

    public CarbonResult(Site site, double totalCO2, double constructionCO2, double operationCO2) {
        this.site = site;
        this.totalCO2 = totalCO2;
        this.constructionCO2 = constructionCO2;
        this.operationCO2 = operationCO2;
        this.createdAt = LocalDateTime.now();
    }
}
