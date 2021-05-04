package com.bmu.pronostics.repository.search;

import com.bmu.pronostics.domain.Equipe;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Equipe} entity.
 */
public interface EquipeSearchRepository extends ElasticsearchRepository<Equipe, Long> {
}
