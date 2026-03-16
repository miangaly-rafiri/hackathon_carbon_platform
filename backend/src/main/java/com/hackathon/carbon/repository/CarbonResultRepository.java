package com.hackathon.carbon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hackathon.carbon.model.CarbonResult;
import com.hackathon.carbon.model.Site;
import java.util.List;

public interface CarbonResultRepository extends JpaRepository<CarbonResult, Long> {
    List<CarbonResult> findBySiteOrderByCreatedAtDesc(Site site);
}
