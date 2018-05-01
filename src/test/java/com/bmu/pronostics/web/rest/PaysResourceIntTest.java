package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;

import com.bmu.pronostics.domain.Pays;
import com.bmu.pronostics.repository.PaysRepository;
import com.bmu.pronostics.repository.search.PaysSearchRepository;
import com.bmu.pronostics.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static com.bmu.pronostics.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PaysResource REST controller.
 *
 * @see PaysResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PronosticsApp.class)
public class PaysResourceIntTest {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_CODE_ISO = "AAAAAAAAAA";
    private static final String UPDATED_CODE_ISO = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DRAPEAU = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DRAPEAU = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_DRAPEAU_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DRAPEAU_CONTENT_TYPE = "image/png";

    @Autowired
    private PaysRepository paysRepository;

    @Autowired
    private PaysSearchRepository paysSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPaysMockMvc;

    private Pays pays;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PaysResource paysResource = new PaysResource(paysRepository, paysSearchRepository);
        this.restPaysMockMvc = MockMvcBuilders.standaloneSetup(paysResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

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

    @Before
    public void initTest() {
        paysSearchRepository.deleteAll();
        pays = createEntity(em);
    }

    @Test
    @Transactional
    public void createPays() throws Exception {
        int databaseSizeBeforeCreate = paysRepository.findAll().size();

        // Create the Pays
        restPaysMockMvc.perform(post("/api/pays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        Pays paysEs = paysSearchRepository.findOne(testPays.getId());
        assertThat(paysEs).isEqualToIgnoringGivenFields(testPays);
    }

    @Test
    @Transactional
    public void createPaysWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paysRepository.findAll().size();

        // Create the Pays with an existing ID
        pays.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaysMockMvc.perform(post("/api/pays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isBadRequest());

        // Validate the Pays in the database
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = paysRepository.findAll().size();
        // set the field null
        pays.setNom(null);

        // Create the Pays, which fails.

        restPaysMockMvc.perform(post("/api/pays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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

        restPaysMockMvc.perform(post("/api/pays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isBadRequest());

        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDrapeauIsRequired() throws Exception {
        int databaseSizeBeforeTest = paysRepository.findAll().size();
        // set the field null
        pays.setDrapeau(null);

        // Create the Pays, which fails.

        restPaysMockMvc.perform(post("/api/pays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pays.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].codeIso").value(hasItem(DEFAULT_CODE_ISO.toString())))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pays.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM.toString()))
            .andExpect(jsonPath("$.codeIso").value(DEFAULT_CODE_ISO.toString()))
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
        paysSearchRepository.save(pays);
        int databaseSizeBeforeUpdate = paysRepository.findAll().size();

        // Update the pays
        Pays updatedPays = paysRepository.findOne(pays.getId());
        // Disconnect from session so that the updates on updatedPays are not directly saved in db
        em.detach(updatedPays);
        updatedPays
            .nom(UPDATED_NOM)
            .codeIso(UPDATED_CODE_ISO)
            .drapeau(UPDATED_DRAPEAU)
            .drapeauContentType(UPDATED_DRAPEAU_CONTENT_TYPE);

        restPaysMockMvc.perform(put("/api/pays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        Pays paysEs = paysSearchRepository.findOne(testPays.getId());
        assertThat(paysEs).isEqualToIgnoringGivenFields(testPays);
    }

    @Test
    @Transactional
    public void updateNonExistingPays() throws Exception {
        int databaseSizeBeforeUpdate = paysRepository.findAll().size();

        // Create the Pays

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPaysMockMvc.perform(put("/api/pays")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pays)))
            .andExpect(status().isCreated());

        // Validate the Pays in the database
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePays() throws Exception {
        // Initialize the database
        paysRepository.saveAndFlush(pays);
        paysSearchRepository.save(pays);
        int databaseSizeBeforeDelete = paysRepository.findAll().size();

        // Get the pays
        restPaysMockMvc.perform(delete("/api/pays/{id}", pays.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean paysExistsInEs = paysSearchRepository.exists(pays.getId());
        assertThat(paysExistsInEs).isFalse();

        // Validate the database is empty
        List<Pays> paysList = paysRepository.findAll();
        assertThat(paysList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPays() throws Exception {
        // Initialize the database
        paysRepository.saveAndFlush(pays);
        paysSearchRepository.save(pays);

        // Search the pays
        restPaysMockMvc.perform(get("/api/_search/pays?query=id:" + pays.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pays.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].codeIso").value(hasItem(DEFAULT_CODE_ISO.toString())))
            .andExpect(jsonPath("$.[*].drapeauContentType").value(hasItem(DEFAULT_DRAPEAU_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].drapeau").value(hasItem(Base64Utils.encodeToString(DEFAULT_DRAPEAU))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pays.class);
        Pays pays1 = new Pays();
        pays1.setId(1L);
        Pays pays2 = new Pays();
        pays2.setId(pays1.getId());
        assertThat(pays1).isEqualTo(pays2);
        pays2.setId(2L);
        assertThat(pays1).isNotEqualTo(pays2);
        pays1.setId(null);
        assertThat(pays1).isNotEqualTo(pays2);
    }
}
