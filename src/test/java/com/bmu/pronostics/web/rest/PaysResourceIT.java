package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;
import com.bmu.pronostics.domain.Pays;
import com.bmu.pronostics.repository.PaysRepository;
import com.bmu.pronostics.repository.search.PaysSearchRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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
 * Integration tests for the {@link PaysResource} REST controller.
 */
@SpringBootTest(classes = PronosticsApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class PaysResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_CODE_ISO = "AAAAAAAAAA";
    private static final String UPDATED_CODE_ISO = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DRAPEAU = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DRAPEAU = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DRAPEAU_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DRAPEAU_CONTENT_TYPE = "image/png";

    @Autowired
    private PaysRepository paysRepository;

    /**
     * This repository is mocked in the com.bmu.pronostics.repository.search test package.
     *
     * @see com.bmu.pronostics.repository.search.PaysSearchRepositoryMockConfiguration
     */
    @Autowired
    private PaysSearchRepository mockPaysSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaysMockMvc;

    private Pays pays;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pays createEntity(EntityManager em) {
        Pays pays = new Pays()
            .nom(DEFAULT_NOM)
            .codeIso(DEFAULT_CODE_ISO)
            .drapeau(DEFAULT_DRAPEAU)
            .drapeauContentType(DEFAULT_DRAPEAU_CONTENT_TYPE);
        return pays;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pays createUpdatedEntity(EntityManager em) {
        Pays pays = new Pays()
            .nom(UPDATED_NOM)
            .codeIso(UPDATED_CODE_ISO)
            .drapeau(UPDATED_DRAPEAU)
            .drapeauContentType(UPDATED_DRAPEAU_CONTENT_TYPE);
        return pays;
    }

    @BeforeEach
    public void initTest() {
        pays = createEntity(em);
    }

    @Test
    @Transactional
    public void createPays() throws Exception {
        int databaseSizeBeforeCreate = paysRepository.findAll().size();
        // Create the Pays
        restPaysMockMvc.perform(post("/api/pays").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isCreated());

        // Validate the Pays in the database
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeCreate + 1);
        Pays testPays = paysList.get(paysList.size() - 1);
        assertThat(testPays.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPays.getCodeIso()).isEqualTo(DEFAULT_CODE_ISO);
        assertThat(testPays.getDrapeau()).isEqualTo(DEFAULT_DRAPEAU);
        assertThat(testPays.getDrapeauContentType()).isEqualTo(DEFAULT_DRAPEAU_CONTENT_TYPE);

        // Validate the Pays in Elasticsearch
        verify(mockPaysSearchRepository, times(1)).save(testPays);
    }

    @Test
    @Transactional
    public void createPaysWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paysRepository.findAll().size();

        // Create the Pays with an existing ID
        pays.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaysMockMvc.perform(post("/api/pays").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeCreate);

        // Validate the Pays in Elasticsearch
        verify(mockPaysSearchRepository, times(0)).save(pays);
    }


    @Test
    @Transactional
    public void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = paysRepository.findAll().size();
        // set the field null
        pays.setNom(null);

        // Create the Pays, which fails.


        restPaysMockMvc.perform(post("/api/pays").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isBadRequest());

        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCodeIsoIsRequired() throws Exception {
        int databaseSizeBeforeTest = paysRepository.findAll().size();
        // set the field null
        pays.setCodeIso(null);

        // Create the Pays, which fails.


        restPaysMockMvc.perform(post("/api/pays").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isBadRequest());

        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPays() throws Exception {
        // Initialize the database
        paysRepository.saveAndFlush(pays);

        // Get all the paysList
        restPaysMockMvc.perform(get("/api/pays?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pays.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].codeIso").value(hasItem(DEFAULT_CODE_ISO)))
            .andExpect(jsonPath("$.[*].drapeauContentType").value(hasItem(DEFAULT_DRAPEAU_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].drapeau").value(hasItem(Base64Utils.encodeToString(DEFAULT_DRAPEAU))));
    }
    
    @Test
    @Transactional
    public void getPays() throws Exception {
        // Initialize the database
        paysRepository.saveAndFlush(pays);

        // Get the pays
        restPaysMockMvc.perform(get("/api/pays/{id}", pays.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pays.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.codeIso").value(DEFAULT_CODE_ISO))
            .andExpect(jsonPath("$.drapeauContentType").value(DEFAULT_DRAPEAU_CONTENT_TYPE))
            .andExpect(jsonPath("$.drapeau").value(Base64Utils.encodeToString(DEFAULT_DRAPEAU)));
    }
    @Test
    @Transactional
    public void getNonExistingPays() throws Exception {
        // Get the pays
        restPaysMockMvc.perform(get("/api/pays/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePays() throws Exception {
        // Initialize the database
        paysRepository.saveAndFlush(pays);

        int databaseSizeBeforeUpdate = paysRepository.findAll().size();

        // Update the pays
        Pays updatedPays = paysRepository.findById(pays.getId()).get();
        // Disconnect from session so that the updates on updatedPays are not directly saved in db
        em.detach(updatedPays);
        updatedPays
            .nom(UPDATED_NOM)
            .codeIso(UPDATED_CODE_ISO)
            .drapeau(UPDATED_DRAPEAU)
            .drapeauContentType(UPDATED_DRAPEAU_CONTENT_TYPE);

        restPaysMockMvc.perform(put("/api/pays").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPays)))
            .andExpect(status().isOk());

        // Validate the Pays in the database
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeUpdate);
        Pays testPays = paysList.get(paysList.size() - 1);
        assertThat(testPays.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPays.getCodeIso()).isEqualTo(UPDATED_CODE_ISO);
        assertThat(testPays.getDrapeau()).isEqualTo(UPDATED_DRAPEAU);
        assertThat(testPays.getDrapeauContentType()).isEqualTo(UPDATED_DRAPEAU_CONTENT_TYPE);

        // Validate the Pays in Elasticsearch
        verify(mockPaysSearchRepository, times(1)).save(testPays);
    }

    @Test
    @Transactional
    public void updateNonExistingPays() throws Exception {
        int databaseSizeBeforeUpdate = paysRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaysMockMvc.perform(put("/api/pays").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Pays in Elasticsearch
        verify(mockPaysSearchRepository, times(0)).save(pays);
    }

    @Test
    @Transactional
    public void deletePays() throws Exception {
        // Initialize the database
        paysRepository.saveAndFlush(pays);

        int databaseSizeBeforeDelete = paysRepository.findAll().size();

        // Delete the pays
        restPaysMockMvc.perform(delete("/api/pays/{id}", pays.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Pays in Elasticsearch
        verify(mockPaysSearchRepository, times(1)).deleteById(pays.getId());
    }

    @Test
    @Transactional
    public void searchPays() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        paysRepository.saveAndFlush(pays);
        when(mockPaysSearchRepository.search(queryStringQuery("id:" + pays.getId())))
            .thenReturn(Collections.singletonList(pays));

        // Search the pays
        restPaysMockMvc.perform(get("/api/_search/pays?query=id:" + pays.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pays.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].codeIso").value(hasItem(DEFAULT_CODE_ISO)))
            .andExpect(jsonPath("$.[*].drapeauContentType").value(hasItem(DEFAULT_DRAPEAU_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].drapeau").value(hasItem(Base64Utils.encodeToString(DEFAULT_DRAPEAU))));
    }
}
