package com.bmu.pronostics.repository.search;

import com.bmu.pronostics.domain.Pronostic;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Pronostic} entity.
 */
public interface PronosticSearchRepository extends ElasticsearchRepository<Pronostic, Long> {
}
