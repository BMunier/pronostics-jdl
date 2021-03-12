package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Equipe;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Equipe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> {

}
