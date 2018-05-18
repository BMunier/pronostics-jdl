package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Toto;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Toto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TotoRepository extends JpaRepository<Toto, Long> {

}
