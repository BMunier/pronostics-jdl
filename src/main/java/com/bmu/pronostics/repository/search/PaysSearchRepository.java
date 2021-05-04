package com.bmu.pronostics.repository.search;

import com.bmu.pronostics.domain.Pays;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Pays} entity.
 */
public interface PaysSearchRepository extends ElasticsearchRepository<Pays, Long> {
}
