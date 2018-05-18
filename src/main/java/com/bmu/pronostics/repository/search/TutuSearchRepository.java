package com.bmu.pronostics.repository.search;

import com.bmu.pronostics.domain.Tutu;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Tutu entity.
 */
public interface TutuSearchRepository extends ElasticsearchRepository<Tutu, Long> {
}
