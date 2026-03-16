
package com.hackathon.carbon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hackathon.carbon.model.Site;

public interface SiteRepository extends JpaRepository<Site,Long> {}
