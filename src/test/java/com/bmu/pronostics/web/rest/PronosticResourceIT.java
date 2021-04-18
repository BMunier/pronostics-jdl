package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;
import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.repository.MatchRepository;
import com.bmu.pronostics.repository.PronosticRepository;
import com.bmu.pronostics.repository.search.PronosticSearchRepository;

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
 * Integration tests for the {@link PronosticResource} REST controller.
 */
@SpringBootTest(classes = PronosticsApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class PronosticResourceIT {

    private static final Integer DEFAULT_SCORE_EQUIPE_DOMICILE = 1;
    private static final Integer UPDATED_SCORE_EQUIPE_DOMICILE = 2;

    private static final Integer DEFAULT_SCORE_EQUIPE_VISITEUR = 1;
    private static final Integer UPDATED_SCORE_EQUIPE_VISITEUR = 2;

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    @Autowired
    private PronosticRepository pronosticRepository;

    /**
     * This repository is mocked in the com.bmu.pronostics.repository.search test package.
     *
     * @see com.bmu.pronostics.repository.search.PronosticSearchRepositoryMockConfiguration
     */
    @Autowired
    private PronosticSearchRepository mockPronosticSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPronosticMockMvc;

    private Pronostic pronostic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if
     * they test an entity which requires the current entity.
     */
    public static Pronostic createEntity(EntityManager em) {
        Pronostic pronostic = new Pronostic().scoreEquipeDomicile(DEFAULT_SCORE_EQUIPE_DOMICILE)
                .scoreEquipeVisiteur(DEFAULT_SCORE_EQUIPE_VISITEUR).points(DEFAULT_POINTS);
        return pronostic;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pronostic createUpdatedEntity(EntityManager em) {
        Pronostic pronostic = new Pronostic()
            .scoreEquipeDomicile(UPDATED_SCORE_EQUIPE_DOMICILE)
            .scoreEquipeVisiteur(UPDATED_SCORE_EQUIPE_VISITEUR)
            .points(UPDATED_POINTS);
        return pronostic;
    }

    @BeforeEach
    public void initTest() {
        pronostic = createEntity(em);
    }

    @Test
    @Transactional
    public void createPronostic() throws Exception {
        int databaseSizeBeforeCreate = pronosticRepository.findAll().size();
        // Create the Pronostic
        restPronosticMockMvc.perform(post("/api/pronostics").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pronostic)))
            .andExpect(status().isCreated());

        // Validate the Pronostic in the database
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeCreate + 1);
        Pronostic testPronostic = pronosticList.get(pronosticList.size() - 1);
        assertThat(testPronostic.getScoreEquipeDomicile()).isEqualTo(DEFAULT_SCORE_EQUIPE_DOMICILE);
        assertThat(testPronostic.getScoreEquipeVisiteur()).isEqualTo(DEFAULT_SCORE_EQUIPE_VISITEUR);
        assertThat(testPronostic.getPoints()).isEqualTo(DEFAULT_POINTS);

        // Validate the Pronostic in Elasticsearch
        verify(mockPronosticSearchRepository, times(1)).save(testPronostic);
    }

    @Test
    @Transactional
    public void createPronosticWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pronosticRepository.findAll().size();

        // Create the Pronostic with an existing ID
        pronostic.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPronosticMockMvc.perform(post("/api/pronostics").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pronostic)))
            .andExpect(status().isBadRequest());

        // Validate the Pronostic in the database
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeCreate);

        // Validate the Pronostic in Elasticsearch
        verify(mockPronosticSearchRepository, times(0)).save(pronostic);
    }


    @Test
    @Transactional
    public void checkScoreEquipeDomicileIsRequired() throws Exception {
        int databaseSizeBeforeTest = pronosticRepository.findAll().size();
        // set the field null
        pronostic.setScoreEquipeDomicile(null);

        // Create the Pronostic, which fails.


        restPronosticMockMvc.perform(post("/api/pronostics").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pronostic)))
            .andExpect(status().isBadRequest());

        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkScoreEquipeVisiteurIsRequired() throws Exception {
        int databaseSizeBeforeTest = pronosticRepository.findAll().size();
        // set the field null
        pronostic.setScoreEquipeVisiteur(null);

        // Create the Pronostic, which fails.


        restPronosticMockMvc.perform(post("/api/pronostics").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pronostic)))
            .andExpect(status().isBadRequest());

        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPronostics() throws Exception {
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);

        // Get all the pronosticList
        restPronosticMockMvc.perform(get("/api/pronostics?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pronostic.getId().intValue())))
            .andExpect(jsonPath("$.[*].scoreEquipeDomicile").value(hasItem(DEFAULT_SCORE_EQUIPE_DOMICILE)))
            .andExpect(jsonPath("$.[*].scoreEquipeVisiteur").value(hasItem(DEFAULT_SCORE_EQUIPE_VISITEUR)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)));
    }

    @Test
    @Transactional
    public void getPronostic() throws Exception {
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);

        // Get the pronostic
        restPronosticMockMvc.perform(get("/api/pronostics/{id}", pronostic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pronostic.getId().intValue()))
            .andExpect(jsonPath("$.scoreEquipeDomicile").value(DEFAULT_SCORE_EQUIPE_DOMICILE))
            .andExpect(jsonPath("$.scoreEquipeVisiteur").value(DEFAULT_SCORE_EQUIPE_VISITEUR))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS));
    }
    @Test
    @Transactional
    public void getNonExistingPronostic() throws Exception {
        // Get the pronostic
        restPronosticMockMvc.perform(get("/api/pronostics/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePronostic() throws Exception {
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);

        int databaseSizeBeforeUpdate = pronosticRepository.findAll().size();

        // Update the pronostic
        Pronostic updatedPronostic = pronosticRepository.findById(pronostic.getId()).get();
        // Disconnect from session so that the updates on updatedPronostic are not directly saved in db
        em.detach(updatedPronostic);
        updatedPronostic.scoreEquipeDomicile(UPDATED_SCORE_EQUIPE_DOMICILE)
                .scoreEquipeVisiteur(UPDATED_SCORE_EQUIPE_VISITEUR).points(UPDATED_POINTS);

        restPronosticMockMvc.perform(put("/api/pronostics").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPronostic)))
            .andExpect(status().isOk());

        // Validate the Pronostic in the database
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeUpdate);
        Pronostic testPronostic = pronosticList.get(pronosticList.size() - 1);
        assertThat(testPronostic.getScoreEquipeDomicile()).isEqualTo(UPDATED_SCORE_EQUIPE_DOMICILE);
        assertThat(testPronostic.getScoreEquipeVisiteur()).isEqualTo(UPDATED_SCORE_EQUIPE_VISITEUR);
        assertThat(testPronostic.getPoints()).isEqualTo(UPDATED_POINTS);

        // Validate the Pronostic in Elasticsearch
        verify(mockPronosticSearchRepository, times(1)).save(testPronostic);
    }

    @Test
    @Transactional
    public void updateNonExistingPronostic() throws Exception {
        int databaseSizeBeforeUpdate = pronosticRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPronosticMockMvc.perform(put("/api/pronostics").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pronostic)))
            .andExpect(status().isBadRequest());

        // Validate the Pronostic in the database
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Pronostic in Elasticsearch
        verify(mockPronosticSearchRepository, times(0)).save(pronostic);
    }

    @Test
    @Transactional
    public void deletePronostic() throws Exception {
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);

        int databaseSizeBeforeDelete = pronosticRepository.findAll().size();

        // Delete the pronostic
        restPronosticMockMvc.perform(delete("/api/pronostics/{id}", pronostic.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Pronostic in Elasticsearch
        verify(mockPronosticSearchRepository, times(1)).deleteById(pronostic.getId());
    }

    @Test
    @Transactional
    public void searchPronostic() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);
        when(mockPronosticSearchRepository.search(queryStringQuery("id:" + pronostic.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(pronostic), PageRequest.of(0, 1), 1));

        // Search the pronostic
        restPronosticMockMvc.perform(get("/api/_search/pronostics?query=id:" + pronostic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pronostic.getId().intValue())))
            .andExpect(jsonPath("$.[*].scoreEquipeDomicile").value(hasItem(DEFAULT_SCORE_EQUIPE_DOMICILE)))
            .andExpect(jsonPath("$.[*].scoreEquipeVisiteur").value(hasItem(DEFAULT_SCORE_EQUIPE_VISITEUR)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)));
    }
}
