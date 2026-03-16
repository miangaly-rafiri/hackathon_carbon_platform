package com.hackathon.carbon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hackathon.carbon.model.Material;
import com.hackathon.carbon.model.Site;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findBySite(Site site);
}
