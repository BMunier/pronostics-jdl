package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Stade;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Stade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StadeRepository extends JpaRepository<Stade, Long> {

}
