package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Match;
import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.domain.User;
import com.bmu.pronostics.domain.enumeration.StatutMatch;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Pronostic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PronosticRepository extends JpaRepository<Pronostic, Long> {

    @Query("select pronostic from Pronostic pronostic where pronostic.utilisateur.login = ?#{principal.username}")
    List<Pronostic> findByUtilisateurIsCurrentUser();

    @Query("select pronostic from Pronostic pronostic where pronostic.match.statut='TERMINE'")
    List<Pronostic> findForMatchsTerminesOnly();

    @Query("select pronostic from Pronostic pronostic where pronostic.match.statut='TERMINE' and pronostic.match.competition.id = :idCompetition")
    List<Pronostic> findForMatchsTerminesAndCompetitionIdOnly(@Param("idCompetition") Long idCompetition);

    List<Pronostic> findByUtilisateurAndMatchIn(User utilisateur, List<Match> lMatchs);


}
