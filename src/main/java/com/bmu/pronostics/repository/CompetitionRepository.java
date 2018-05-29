package com.bmu.pronostics.repository;

import com.bmu.pronostics.domain.Competition;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Competition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {
    @Query("select distinct competition from Competition competition left join fetch competition.equipes left join fetch competition.pays left join fetch competition.stades")
    List<Competition> findAllWithEagerRelationships();

    @Query("select competition from Competition competition left join fetch competition.equipes left join fetch competition.pays left join fetch competition.stades where competition.id =:id")
    Competition findOneWithEagerRelationships(@Param("id") Long id);

}
