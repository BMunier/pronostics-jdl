package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;
import com.bmu.pronostics.domain.Stade;
import com.bmu.pronostics.repository.StadeRepository;
import com.bmu.pronostics.repository.search.StadeSearchRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link StadeResource} REST controller.
 */
@SpringBootTest(classes = PronosticsApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class StadeResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_VILLE = "AAAAAAAAAA";
    private static final String UPDATED_VILLE = "BBBBBBBBBB";

    @Autowired
    private StadeRepository stadeRepository;

    /**
     * This repository is mocked in the com.bmu.pronostics.repository.search test package.
     *
     * @see com.bmu.pronostics.repository.search.StadeSearchRepositoryMockConfiguration
     */
    @Autowired
    private StadeSearchRepository mockStadeSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStadeMockMvc;

    private Stade stade;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stade createEntity(EntityManager em) {
        Stade stade = new Stade()
            .nom(DEFAULT_NOM)
            .ville(DEFAULT_VILLE);
        return stade;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stade createUpdatedEntity(EntityManager em) {
        Stade stade = new Stade()
            .nom(UPDATED_NOM)
            .ville(UPDATED_VILLE);
        return stade;
    }

    @BeforeEach
    public void initTest() {
        stade = createEntity(em);
    }

    @Test
    @Transactional
    public void createStade() throws Exception {
        int databaseSizeBeforeCreate = stadeRepository.findAll().size();
        // Create the Stade
        restStadeMockMvc.perform(post("/api/stades").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isCreated());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate + 1);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testStade.getVille()).isEqualTo(DEFAULT_VILLE);

        // Validate the Stade in Elasticsearch
        verify(mockStadeSearchRepository, times(1)).save(testStade);
    }

    @Test
    @Transactional
    public void createStadeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = stadeRepository.findAll().size();

        // Create the Stade with an existing ID
        stade.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStadeMockMvc.perform(post("/api/stades").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Stade in Elasticsearch
        verify(mockStadeSearchRepository, times(0)).save(stade);
    }


    @Test
    @Transactional
    public void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = stadeRepository.findAll().size();
        // set the field null
        stade.setNom(null);

        // Create the Stade, which fails.


        restStadeMockMvc.perform(post("/api/stades").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isBadRequest());

        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkVilleIsRequired() throws Exception {
        int databaseSizeBeforeTest = stadeRepository.findAll().size();
        // set the field null
        stade.setVille(null);

        // Create the Stade, which fails.


        restStadeMockMvc.perform(post("/api/stades").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isBadRequest());

        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStades() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        // Get all the stadeList
        restStadeMockMvc.perform(get("/api/stades?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].ville").value(hasItem(DEFAULT_VILLE)));
    }
    
    @Test
    @Transactional
    public void getStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        // Get the stade
        restStadeMockMvc.perform(get("/api/stades/{id}", stade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stade.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.ville").value(DEFAULT_VILLE));
    }
    @Test
    @Transactional
    public void getNonExistingStade() throws Exception {
        // Get the stade
        restStadeMockMvc.perform(get("/api/stades/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade
        Stade updatedStade = stadeRepository.findById(stade.getId()).get();
        // Disconnect from session so that the updates on updatedStade are not directly saved in db
        em.detach(updatedStade);
        updatedStade
            .nom(UPDATED_NOM)
            .ville(UPDATED_VILLE);

        restStadeMockMvc.perform(put("/api/stades").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedStade)))
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testStade.getVille()).isEqualTo(UPDATED_VILLE);

        // Validate the Stade in Elasticsearch
        verify(mockStadeSearchRepository, times(1)).save(testStade);
    }

    @Test
    @Transactional
    public void updateNonExistingStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStadeMockMvc.perform(put("/api/stades").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Stade in Elasticsearch
        verify(mockStadeSearchRepository, times(0)).save(stade);
    }

    @Test
    @Transactional
    public void deleteStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        int databaseSizeBeforeDelete = stadeRepository.findAll().size();

        // Delete the stade
        restStadeMockMvc.perform(delete("/api/stades/{id}", stade.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Stade in Elasticsearch
        verify(mockStadeSearchRepository, times(1)).deleteById(stade.getId());
    }

    @Test
    @Transactional
    public void searchStade() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        stadeRepository.saveAndFlush(stade);
        when(mockStadeSearchRepository.search(queryStringQuery("id:" + stade.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(stade), PageRequest.of(0, 1), 1));

        // Search the stade
        restStadeMockMvc.perform(get("/api/_search/stades?query=id:" + stade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].ville").value(hasItem(DEFAULT_VILLE)));
    }
}
