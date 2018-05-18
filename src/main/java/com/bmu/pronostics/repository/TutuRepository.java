package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Tutu;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Tutu entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TutuRepository extends JpaRepository<Tutu, Long> {

}
