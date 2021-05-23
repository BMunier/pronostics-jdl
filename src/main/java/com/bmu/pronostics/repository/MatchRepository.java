package com.bmu.pronostics.repository;

import java.util.List;

import com.bmu.pronostics.domain.Competition;
import com.bmu.pronostics.domain.Match;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Match entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findAllByCompetition(Competition competition);

}
