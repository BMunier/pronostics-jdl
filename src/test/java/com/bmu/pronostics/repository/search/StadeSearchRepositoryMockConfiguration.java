package com.bmu.pronostics.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link StadeSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class StadeSearchRepositoryMockConfiguration {

    @MockBean
    private StadeSearchRepository mockStadeSearchRepository;

}
