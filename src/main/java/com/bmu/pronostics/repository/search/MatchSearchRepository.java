package com.bmu.pronostics.repository.search;

import com.bmu.pronostics.domain.Match;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Match} entity.
 */
public interface MatchSearchRepository extends ElasticsearchRepository<Match, Long> {
}
