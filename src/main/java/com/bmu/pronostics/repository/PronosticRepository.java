package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Pronostic;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Pronostic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PronosticRepository extends JpaRepository<Pronostic, Long> {

    @Query("select pronostic from Pronostic pronostic where pronostic.utilisateur.login = ?#{principal.username}")
    List<Pronostic> findByUtilisateurIsCurrentUser();

}
