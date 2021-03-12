package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;

import com.bmu.pronostics.domain.Competition;
import com.bmu.pronostics.repository.CompetitionRepository;
import com.bmu.pronostics.repository.search.CompetitionSearchRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.bmu.pronostics.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CompetitionResource REST controller.
 *
 * @see CompetitionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PronosticsApp.class)
public class CompetitionResourceIntTest {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private CompetitionRepository competitionRepository;

    @Autowired
    private CompetitionSearchRepository competitionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCompetitionMockMvc;

    private Competition competition;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CompetitionResource competitionResource = new CompetitionResource(competitionRepository, competitionSearchRepository);
        this.restCompetitionMockMvc = MockMvcBuilders.standaloneSetup(competitionResource)
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
    public static Competition createEntity(EntityManager em) {
        Competition competition = new Competition()
            .nom(DEFAULT_NOM)
            .description(DEFAULT_DESCRIPTION)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN);
        return competition;
    }

    @Before
    public void initTest() {
        competitionSearchRepository.deleteAll();
        competition = createEntity(em);
    }

    @Test
    @Transactional
    public void createCompetition() throws Exception {
        int databaseSizeBeforeCreate = competitionRepository.findAll().size();

        // Create the Competition
        restCompetitionMockMvc.perform(post("/api/competitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isCreated());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeCreate + 1);
        Competition testCompetition = competitionList.get(competitionList.size() - 1);
        assertThat(testCompetition.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCompetition.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCompetition.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testCompetition.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);

        // Validate the Competition in Elasticsearch
        Competition competitionEs = competitionSearchRepository.findOne(testCompetition.getId());
        assertThat(competitionEs).isEqualToIgnoringGivenFields(testCompetition);
    }

    @Test
    @Transactional
    public void createCompetitionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = competitionRepository.findAll().size();

        // Create the Competition with an existing ID
        competition.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompetitionMockMvc.perform(post("/api/competitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isBadRequest());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = competitionRepository.findAll().size();
        // set the field null
        competition.setNom(null);

        // Create the Competition, which fails.

        restCompetitionMockMvc.perform(post("/api/competitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isBadRequest());

        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateDebutIsRequired() throws Exception {
        int databaseSizeBeforeTest = competitionRepository.findAll().size();
        // set the field null
        competition.setDateDebut(null);

        // Create the Competition, which fails.

        restCompetitionMockMvc.perform(post("/api/competitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isBadRequest());

        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateFinIsRequired() throws Exception {
        int databaseSizeBeforeTest = competitionRepository.findAll().size();
        // set the field null
        competition.setDateFin(null);

        // Create the Competition, which fails.

        restCompetitionMockMvc.perform(post("/api/competitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isBadRequest());

        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCompetitions() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        // Get all the competitionList
        restCompetitionMockMvc.perform(get("/api/competitions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(competition.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    public void getCompetition() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);

        // Get the competition
        restCompetitionMockMvc.perform(get("/api/competitions/{id}", competition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(competition.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCompetition() throws Exception {
        // Get the competition
        restCompetitionMockMvc.perform(get("/api/competitions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCompetition() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);
        competitionSearchRepository.save(competition);
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();

        // Update the competition
        Competition updatedCompetition = competitionRepository.findOne(competition.getId());
        // Disconnect from session so that the updates on updatedCompetition are not directly saved in db
        em.detach(updatedCompetition);
        updatedCompetition
            .nom(UPDATED_NOM)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN);

        restCompetitionMockMvc.perform(put("/api/competitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCompetition)))
            .andExpect(status().isOk());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate);
        Competition testCompetition = competitionList.get(competitionList.size() - 1);
        assertThat(testCompetition.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCompetition.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCompetition.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testCompetition.getDateFin()).isEqualTo(UPDATED_DATE_FIN);

        // Validate the Competition in Elasticsearch
        Competition competitionEs = competitionSearchRepository.findOne(testCompetition.getId());
        assertThat(competitionEs).isEqualToIgnoringGivenFields(testCompetition);
    }

    @Test
    @Transactional
    public void updateNonExistingCompetition() throws Exception {
        int databaseSizeBeforeUpdate = competitionRepository.findAll().size();

        // Create the Competition

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCompetitionMockMvc.perform(put("/api/competitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(competition)))
            .andExpect(status().isCreated());

        // Validate the Competition in the database
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCompetition() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);
        competitionSearchRepository.save(competition);
        int databaseSizeBeforeDelete = competitionRepository.findAll().size();

        // Get the competition
        restCompetitionMockMvc.perform(delete("/api/competitions/{id}", competition.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean competitionExistsInEs = competitionSearchRepository.exists(competition.getId());
        assertThat(competitionExistsInEs).isFalse();

        // Validate the database is empty
        List<Competition> competitionList = competitionRepository.findAll();
        assertThat(competitionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCompetition() throws Exception {
        // Initialize the database
        competitionRepository.saveAndFlush(competition);
        competitionSearchRepository.save(competition);

        // Search the competition
        restCompetitionMockMvc.perform(get("/api/_search/competitions?query=id:" + competition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(competition.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Competition.class);
        Competition competition1 = new Competition();
        competition1.setId(1L);
        Competition competition2 = new Competition();
        competition2.setId(competition1.getId());
        assertThat(competition1).isEqualTo(competition2);
        competition2.setId(2L);
        assertThat(competition1).isNotEqualTo(competition2);
        competition1.setId(null);
        assertThat(competition1).isNotEqualTo(competition2);
    }
}
