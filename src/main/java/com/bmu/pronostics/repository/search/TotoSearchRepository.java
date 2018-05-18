package com.bmu.pronostics.repository.search;

import com.bmu.pronostics.domain.Toto;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Toto entity.
 */
public interface TotoSearchRepository extends ElasticsearchRepository<Toto, Long> {
}
