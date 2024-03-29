package com.bmu.pronostics.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link EquipeSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class EquipeSearchRepositoryMockConfiguration {

    @MockBean
    private EquipeSearchRepository mockEquipeSearchRepository;

}
