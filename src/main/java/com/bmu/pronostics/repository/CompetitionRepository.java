package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Competition;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Competition entity.
 */
@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {

    @Query(value = "select distinct competition from Competition competition left join fetch competition.equipes left join fetch competition.pays left join fetch competition.stades",
        countQuery = "select count(distinct competition) from Competition competition")
    Page<Competition> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct competition from Competition competition left join fetch competition.equipes left join fetch competition.pays left join fetch competition.stades")
    List<Competition> findAllWithEagerRelationships();

    @Query("select competition from Competition competition left join fetch competition.equipes left join fetch competition.pays left join fetch competition.stades where competition.id =:id")
    Optional<Competition> findOneWithEagerRelationships(@Param("id") Long id);
}
