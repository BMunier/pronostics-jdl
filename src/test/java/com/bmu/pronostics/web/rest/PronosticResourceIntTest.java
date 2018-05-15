package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;

import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.repository.MatchRepository;
import com.bmu.pronostics.repository.PronosticRepository;
import com.bmu.pronostics.repository.search.PronosticSearchRepository;
import com.bmu.pronostics.service.UserService;
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
 * Test class for the PronosticResource REST controller.
 *
 * @see PronosticResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PronosticsApp.class)
public class PronosticResourceIntTest {

    private static final Integer DEFAULT_SCORE_EQUIPE_DOMICILE = 1;
    private static final Integer UPDATED_SCORE_EQUIPE_DOMICILE = 2;

    private static final Integer DEFAULT_SCORE_EQUIPE_VISITEUR = 1;
    private static final Integer UPDATED_SCORE_EQUIPE_VISITEUR = 2;

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    @Autowired
    private UserService userService;
    @Autowired
    private MatchRepository matchRepository;
    
    @Autowired
    private PronosticRepository pronosticRepository;

    @Autowired
    private PronosticSearchRepository pronosticSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPronosticMockMvc;

    private Pronostic pronostic;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PronosticResource pronosticResource = new PronosticResource(pronosticRepository, pronosticSearchRepository,userService,matchRepository);
        this.restPronosticMockMvc = MockMvcBuilders.standaloneSetup(pronosticResource)
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
    public static Pronostic createEntity(EntityManager em) {
        Pronostic pronostic = new Pronostic()
            .scoreEquipeDomicile(DEFAULT_SCORE_EQUIPE_DOMICILE)
            .scoreEquipeVisiteur(DEFAULT_SCORE_EQUIPE_VISITEUR)
            .points(DEFAULT_POINTS);
        return pronostic;
    }

    @Before
    public void initTest() {
        pronosticSearchRepository.deleteAll();
        pronostic = createEntity(em);
    }

    @Test
    @Transactional
    public void createPronostic() throws Exception {
        int databaseSizeBeforeCreate = pronosticRepository.findAll().size();

        // Create the Pronostic
        restPronosticMockMvc.perform(post("/api/pronostics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        Pronostic pronosticEs = pronosticSearchRepository.findOne(testPronostic.getId());
        assertThat(pronosticEs).isEqualToIgnoringGivenFields(testPronostic);
    }

    @Test
    @Transactional
    public void createPronosticWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pronosticRepository.findAll().size();

        // Create the Pronostic with an existing ID
        pronostic.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPronosticMockMvc.perform(post("/api/pronostics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pronostic)))
            .andExpect(status().isBadRequest());

        // Validate the Pronostic in the database
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkScoreEquipeDomicileIsRequired() throws Exception {
        int databaseSizeBeforeTest = pronosticRepository.findAll().size();
        // set the field null
        pronostic.setScoreEquipeDomicile(null);

        // Create the Pronostic, which fails.

        restPronosticMockMvc.perform(post("/api/pronostics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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

        restPronosticMockMvc.perform(post("/api/pronostics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pronostic.getId().intValue()))
            .andExpect(jsonPath("$.scoreEquipeDomicile").value(DEFAULT_SCORE_EQUIPE_DOMICILE))
            .andExpect(jsonPath("$.scoreEquipeVisiteur").value(DEFAULT_SCORE_EQUIPE_VISITEUR))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS));
    }

    @Test
    @Transactional
    public void getNonExistingPronostic() throws Exception {
        // Get the pronostic
        restPronosticMockMvc.perform(get("/api/pronostics/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePronostic() throws Exception {
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);
        pronosticSearchRepository.save(pronostic);
        int databaseSizeBeforeUpdate = pronosticRepository.findAll().size();

        // Update the pronostic
        Pronostic updatedPronostic = pronosticRepository.findOne(pronostic.getId());
        // Disconnect from session so that the updates on updatedPronostic are not directly saved in db
        em.detach(updatedPronostic);
        updatedPronostic
            .scoreEquipeDomicile(UPDATED_SCORE_EQUIPE_DOMICILE)
            .scoreEquipeVisiteur(UPDATED_SCORE_EQUIPE_VISITEUR)
            .points(UPDATED_POINTS);

        restPronosticMockMvc.perform(put("/api/pronostics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        Pronostic pronosticEs = pronosticSearchRepository.findOne(testPronostic.getId());
        assertThat(pronosticEs).isEqualToIgnoringGivenFields(testPronostic);
    }

    @Test
    @Transactional
    public void updateNonExistingPronostic() throws Exception {
        int databaseSizeBeforeUpdate = pronosticRepository.findAll().size();

        // Create the Pronostic

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPronosticMockMvc.perform(put("/api/pronostics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pronostic)))
            .andExpect(status().isCreated());

        // Validate the Pronostic in the database
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePronostic() throws Exception {
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);
        pronosticSearchRepository.save(pronostic);
        int databaseSizeBeforeDelete = pronosticRepository.findAll().size();

        // Get the pronostic
        restPronosticMockMvc.perform(delete("/api/pronostics/{id}", pronostic.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean pronosticExistsInEs = pronosticSearchRepository.exists(pronostic.getId());
        assertThat(pronosticExistsInEs).isFalse();

        // Validate the database is empty
        List<Pronostic> pronosticList = pronosticRepository.findAll();
        assertThat(pronosticList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPronostic() throws Exception {
        // Initialize the database
        pronosticRepository.saveAndFlush(pronostic);
        pronosticSearchRepository.save(pronostic);

        // Search the pronostic
        restPronosticMockMvc.perform(get("/api/_search/pronostics?query=id:" + pronostic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pronostic.getId().intValue())))
            .andExpect(jsonPath("$.[*].scoreEquipeDomicile").value(hasItem(DEFAULT_SCORE_EQUIPE_DOMICILE)))
            .andExpect(jsonPath("$.[*].scoreEquipeVisiteur").value(hasItem(DEFAULT_SCORE_EQUIPE_VISITEUR)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pronostic.class);
        Pronostic pronostic1 = new Pronostic();
        pronostic1.setId(1L);
        Pronostic pronostic2 = new Pronostic();
        pronostic2.setId(pronostic1.getId());
        assertThat(pronostic1).isEqualTo(pronostic2);
        pronostic2.setId(2L);
        assertThat(pronostic1).isNotEqualTo(pronostic2);
        pronostic1.setId(null);
        assertThat(pronostic1).isNotEqualTo(pronostic2);
    }
}
