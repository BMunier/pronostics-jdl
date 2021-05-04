package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;
import com.bmu.pronostics.domain.Equipe;
import com.bmu.pronostics.repository.EquipeRepository;
import com.bmu.pronostics.repository.search.EquipeSearchRepository;

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
import org.springframework.util.Base64Utils;
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
 * Integration tests for the {@link EquipeResource} REST controller.
 */
@SpringBootTest(classes = PronosticsApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class EquipeResourceIT {

    private static final String DEFAULT_CODE_EQUIPE = "AAAAAAAAAA";
    private static final String UPDATED_CODE_EQUIPE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM_EQUIPE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_EQUIPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_RANG_FIFA = 1;
    private static final Integer UPDATED_RANG_FIFA = 2;

    private static final byte[] DEFAULT_ECUSSON = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ECUSSON = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ECUSSON_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ECUSSON_CONTENT_TYPE = "image/png";

    @Autowired
    private EquipeRepository equipeRepository;

    /**
     * This repository is mocked in the com.bmu.pronostics.repository.search test package.
     *
     * @see com.bmu.pronostics.repository.search.EquipeSearchRepositoryMockConfiguration
     */
    @Autowired
    private EquipeSearchRepository mockEquipeSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEquipeMockMvc;

    private Equipe equipe;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Equipe createEntity(EntityManager em) {
        Equipe equipe = new Equipe()
            .codeEquipe(DEFAULT_CODE_EQUIPE)
            .nomEquipe(DEFAULT_NOM_EQUIPE)
            .rangFifa(DEFAULT_RANG_FIFA)
            .ecusson(DEFAULT_ECUSSON)
            .ecussonContentType(DEFAULT_ECUSSON_CONTENT_TYPE);
        return equipe;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Equipe createUpdatedEntity(EntityManager em) {
        Equipe equipe = new Equipe()
            .codeEquipe(UPDATED_CODE_EQUIPE)
            .nomEquipe(UPDATED_NOM_EQUIPE)
            .rangFifa(UPDATED_RANG_FIFA)
            .ecusson(UPDATED_ECUSSON)
            .ecussonContentType(UPDATED_ECUSSON_CONTENT_TYPE);
        return equipe;
    }

    @BeforeEach
    public void initTest() {
        equipe = createEntity(em);
    }

    @Test
    @Transactional
    public void createEquipe() throws Exception {
        int databaseSizeBeforeCreate = equipeRepository.findAll().size();
        // Create the Equipe
        restEquipeMockMvc.perform(post("/api/equipes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipe)))
            .andExpect(status().isCreated());

        // Validate the Equipe in the database
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeCreate + 1);
        Equipe testEquipe = equipeList.get(equipeList.size() - 1);
        assertThat(testEquipe.getCodeEquipe()).isEqualTo(DEFAULT_CODE_EQUIPE);
        assertThat(testEquipe.getNomEquipe()).isEqualTo(DEFAULT_NOM_EQUIPE);
        assertThat(testEquipe.getRangFifa()).isEqualTo(DEFAULT_RANG_FIFA);
        assertThat(testEquipe.getEcusson()).isEqualTo(DEFAULT_ECUSSON);
        assertThat(testEquipe.getEcussonContentType()).isEqualTo(DEFAULT_ECUSSON_CONTENT_TYPE);

        // Validate the Equipe in Elasticsearch
        verify(mockEquipeSearchRepository, times(1)).save(testEquipe);
    }

    @Test
    @Transactional
    public void createEquipeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = equipeRepository.findAll().size();

        // Create the Equipe with an existing ID
        equipe.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEquipeMockMvc.perform(post("/api/equipes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipe)))
            .andExpect(status().isBadRequest());

        // Validate the Equipe in the database
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Equipe in Elasticsearch
        verify(mockEquipeSearchRepository, times(0)).save(equipe);
    }


    @Test
    @Transactional
    public void getAllEquipes() throws Exception {
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);

        // Get all the equipeList
        restEquipeMockMvc.perform(get("/api/equipes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].codeEquipe").value(hasItem(DEFAULT_CODE_EQUIPE)))
            .andExpect(jsonPath("$.[*].nomEquipe").value(hasItem(DEFAULT_NOM_EQUIPE)))
            .andExpect(jsonPath("$.[*].rangFifa").value(hasItem(DEFAULT_RANG_FIFA)))
            .andExpect(jsonPath("$.[*].ecussonContentType").value(hasItem(DEFAULT_ECUSSON_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].ecusson").value(hasItem(Base64Utils.encodeToString(DEFAULT_ECUSSON))));
    }
    
    @Test
    @Transactional
    public void getEquipe() throws Exception {
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);

        // Get the equipe
        restEquipeMockMvc.perform(get("/api/equipes/{id}", equipe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(equipe.getId().intValue()))
            .andExpect(jsonPath("$.codeEquipe").value(DEFAULT_CODE_EQUIPE))
            .andExpect(jsonPath("$.nomEquipe").value(DEFAULT_NOM_EQUIPE))
            .andExpect(jsonPath("$.rangFifa").value(DEFAULT_RANG_FIFA))
            .andExpect(jsonPath("$.ecussonContentType").value(DEFAULT_ECUSSON_CONTENT_TYPE))
            .andExpect(jsonPath("$.ecusson").value(Base64Utils.encodeToString(DEFAULT_ECUSSON)));
    }
    @Test
    @Transactional
    public void getNonExistingEquipe() throws Exception {
        // Get the equipe
        restEquipeMockMvc.perform(get("/api/equipes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEquipe() throws Exception {
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);

        int databaseSizeBeforeUpdate = equipeRepository.findAll().size();

        // Update the equipe
        Equipe updatedEquipe = equipeRepository.findById(equipe.getId()).get();
        // Disconnect from session so that the updates on updatedEquipe are not directly saved in db
        em.detach(updatedEquipe);
        updatedEquipe
            .codeEquipe(UPDATED_CODE_EQUIPE)
            .nomEquipe(UPDATED_NOM_EQUIPE)
            .rangFifa(UPDATED_RANG_FIFA)
            .ecusson(UPDATED_ECUSSON)
            .ecussonContentType(UPDATED_ECUSSON_CONTENT_TYPE);

        restEquipeMockMvc.perform(put("/api/equipes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedEquipe)))
            .andExpect(status().isOk());

        // Validate the Equipe in the database
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeUpdate);
        Equipe testEquipe = equipeList.get(equipeList.size() - 1);
        assertThat(testEquipe.getCodeEquipe()).isEqualTo(UPDATED_CODE_EQUIPE);
        assertThat(testEquipe.getNomEquipe()).isEqualTo(UPDATED_NOM_EQUIPE);
        assertThat(testEquipe.getRangFifa()).isEqualTo(UPDATED_RANG_FIFA);
        assertThat(testEquipe.getEcusson()).isEqualTo(UPDATED_ECUSSON);
        assertThat(testEquipe.getEcussonContentType()).isEqualTo(UPDATED_ECUSSON_CONTENT_TYPE);

        // Validate the Equipe in Elasticsearch
        verify(mockEquipeSearchRepository, times(1)).save(testEquipe);
    }

    @Test
    @Transactional
    public void updateNonExistingEquipe() throws Exception {
        int databaseSizeBeforeUpdate = equipeRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEquipeMockMvc.perform(put("/api/equipes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(equipe)))
            .andExpect(status().isBadRequest());

        // Validate the Equipe in the database
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Equipe in Elasticsearch
        verify(mockEquipeSearchRepository, times(0)).save(equipe);
    }

    @Test
    @Transactional
    public void deleteEquipe() throws Exception {
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);

        int databaseSizeBeforeDelete = equipeRepository.findAll().size();

        // Delete the equipe
        restEquipeMockMvc.perform(delete("/api/equipes/{id}", equipe.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Equipe in Elasticsearch
        verify(mockEquipeSearchRepository, times(1)).deleteById(equipe.getId());
    }

    @Test
    @Transactional
    public void searchEquipe() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);
        when(mockEquipeSearchRepository.search(queryStringQuery("id:" + equipe.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(equipe), PageRequest.of(0, 1), 1));

        // Search the equipe
        restEquipeMockMvc.perform(get("/api/_search/equipes?query=id:" + equipe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].codeEquipe").value(hasItem(DEFAULT_CODE_EQUIPE)))
            .andExpect(jsonPath("$.[*].nomEquipe").value(hasItem(DEFAULT_NOM_EQUIPE)))
            .andExpect(jsonPath("$.[*].rangFifa").value(hasItem(DEFAULT_RANG_FIFA)))
            .andExpect(jsonPath("$.[*].ecussonContentType").value(hasItem(DEFAULT_ECUSSON_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].ecusson").value(hasItem(Base64Utils.encodeToString(DEFAULT_ECUSSON))));
    }
}
