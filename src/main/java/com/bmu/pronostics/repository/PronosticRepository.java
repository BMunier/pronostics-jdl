package com.bmu.pronostics.repository;

import java.util.List;

import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.domain.User;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Pronostic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PronosticRepository extends JpaRepository<Pronostic, Long> {
    List<Pronostic> findAllByUtilisateur(Pageable pageable, User user);
}
