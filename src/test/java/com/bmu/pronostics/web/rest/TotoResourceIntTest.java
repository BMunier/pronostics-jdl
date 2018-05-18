package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;

import com.bmu.pronostics.domain.Toto;
import com.bmu.pronostics.repository.TotoRepository;
import com.bmu.pronostics.repository.search.TotoSearchRepository;
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

import javax.persistence.EntityManager;
import java.util.List;

import static com.bmu.pronostics.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TotoResource REST controller.
 *
 * @see TotoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PronosticsApp.class)
public class TotoResourceIntTest {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final String DEFAULT_AGE = "AAAAAAAAAA";
    private static final String UPDATED_AGE = "BBBBBBBBBB";

    @Autowired
    private TotoRepository totoRepository;

    @Autowired
    private TotoSearchRepository totoSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTotoMockMvc;

    private Toto toto;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TotoResource totoResource = new TotoResource(totoRepository, totoSearchRepository);
        this.restTotoMockMvc = MockMvcBuilders.standaloneSetup(totoResource)
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
    public static Toto createEntity(EntityManager em) {
        Toto toto = new Toto()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .age(DEFAULT_AGE);
        return toto;
    }

    @Before
    public void initTest() {
        totoSearchRepository.deleteAll();
        toto = createEntity(em);
    }

    @Test
    @Transactional
    public void createToto() throws Exception {
        int databaseSizeBeforeCreate = totoRepository.findAll().size();

        // Create the Toto
        restTotoMockMvc.perform(post("/api/totos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toto)))
            .andExpect(status().isCreated());

        // Validate the Toto in the database
        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeCreate + 1);
        Toto testToto = totoList.get(totoList.size() - 1);
        assertThat(testToto.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testToto.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testToto.getAge()).isEqualTo(DEFAULT_AGE);

        // Validate the Toto in Elasticsearch
        Toto totoEs = totoSearchRepository.findOne(testToto.getId());
        assertThat(totoEs).isEqualToIgnoringGivenFields(testToto);
    }

    @Test
    @Transactional
    public void createTotoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = totoRepository.findAll().size();

        // Create the Toto with an existing ID
        toto.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTotoMockMvc.perform(post("/api/totos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toto)))
            .andExpect(status().isBadRequest());

        // Validate the Toto in the database
        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = totoRepository.findAll().size();
        // set the field null
        toto.setNom(null);

        // Create the Toto, which fails.

        restTotoMockMvc.perform(post("/api/totos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toto)))
            .andExpect(status().isBadRequest());

        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPrenomIsRequired() throws Exception {
        int databaseSizeBeforeTest = totoRepository.findAll().size();
        // set the field null
        toto.setPrenom(null);

        // Create the Toto, which fails.

        restTotoMockMvc.perform(post("/api/totos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toto)))
            .andExpect(status().isBadRequest());

        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAgeIsRequired() throws Exception {
        int databaseSizeBeforeTest = totoRepository.findAll().size();
        // set the field null
        toto.setAge(null);

        // Create the Toto, which fails.

        restTotoMockMvc.perform(post("/api/totos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toto)))
            .andExpect(status().isBadRequest());

        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTotos() throws Exception {
        // Initialize the database
        totoRepository.saveAndFlush(toto);

        // Get all the totoList
        restTotoMockMvc.perform(get("/api/totos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(toto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM.toString())))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE.toString())));
    }

    @Test
    @Transactional
    public void getToto() throws Exception {
        // Initialize the database
        totoRepository.saveAndFlush(toto);

        // Get the toto
        restTotoMockMvc.perform(get("/api/totos/{id}", toto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(toto.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM.toString()))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM.toString()))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingToto() throws Exception {
        // Get the toto
        restTotoMockMvc.perform(get("/api/totos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateToto() throws Exception {
        // Initialize the database
        totoRepository.saveAndFlush(toto);
        totoSearchRepository.save(toto);
        int databaseSizeBeforeUpdate = totoRepository.findAll().size();

        // Update the toto
        Toto updatedToto = totoRepository.findOne(toto.getId());
        // Disconnect from session so that the updates on updatedToto are not directly saved in db
        em.detach(updatedToto);
        updatedToto
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .age(UPDATED_AGE);

        restTotoMockMvc.perform(put("/api/totos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedToto)))
            .andExpect(status().isOk());

        // Validate the Toto in the database
        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeUpdate);
        Toto testToto = totoList.get(totoList.size() - 1);
        assertThat(testToto.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testToto.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testToto.getAge()).isEqualTo(UPDATED_AGE);

        // Validate the Toto in Elasticsearch
        Toto totoEs = totoSearchRepository.findOne(testToto.getId());
        assertThat(totoEs).isEqualToIgnoringGivenFields(testToto);
    }

    @Test
    @Transactional
    public void updateNonExistingToto() throws Exception {
        int databaseSizeBeforeUpdate = totoRepository.findAll().size();

        // Create the Toto

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTotoMockMvc.perform(put("/api/totos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toto)))
            .andExpect(status().isCreated());

        // Validate the Toto in the database
        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteToto() throws Exception {
        // Initialize the database
        totoRepository.saveAndFlush(toto);
        totoSearchRepository.save(toto);
        int databaseSizeBeforeDelete = totoRepository.findAll().size();

        // Get the toto
        restTotoMockMvc.perform(delete("/api/totos/{id}", toto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean totoExistsInEs = totoSearchRepository.exists(toto.getId());
        assertThat(totoExistsInEs).isFalse();

        // Validate the database is empty
        List<Toto> totoList = totoRepository.findAll();
        assertThat(totoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchToto() throws Exception {
        // Initialize the database
        totoRepository.saveAndFlush(toto);
        totoSearchRepository.save(toto);

        // Search the toto
        restTotoMockMvc.perform(get("/api/_search/totos?query=id:" + toto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(toto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM.toString())))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Toto.class);
        Toto toto1 = new Toto();
        toto1.setId(1L);
        Toto toto2 = new Toto();
        toto2.setId(toto1.getId());
        assertThat(toto1).isEqualTo(toto2);
        toto2.setId(2L);
        assertThat(toto1).isNotEqualTo(toto2);
        toto1.setId(null);
        assertThat(toto1).isNotEqualTo(toto2);
    }
}
