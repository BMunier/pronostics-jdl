package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Stade;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Stade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StadeRepository extends JpaRepository<Stade, Long> {
}
