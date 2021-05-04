package com.bmu.pronostics.repository.search;

import com.bmu.pronostics.domain.Competition;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Competition} entity.
 */
public interface CompetitionSearchRepository extends ElasticsearchRepository<Competition, Long> {
}
