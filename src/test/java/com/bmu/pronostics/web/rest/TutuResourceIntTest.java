package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;

import com.bmu.pronostics.domain.Tutu;
import com.bmu.pronostics.repository.TutuRepository;
import com.bmu.pronostics.repository.search.TutuSearchRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.bmu.pronostics.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TutuResource REST controller.
 *
 * @see TutuResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PronosticsApp.class)
public class TutuResourceIntTest {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private TutuRepository tutuRepository;

    @Autowired
    private TutuSearchRepository tutuSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTutuMockMvc;

    private Tutu tutu;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TutuResource tutuResource = new TutuResource(tutuRepository, tutuSearchRepository);
        this.restTutuMockMvc = MockMvcBuilders.standaloneSetup(tutuResource)
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
    public static Tutu createEntity(EntityManager em) {
        Tutu tutu = new Tutu()
            .date(DEFAULT_DATE);
        return tutu;
    }

    @Before
    public void initTest() {
        tutuSearchRepository.deleteAll();
        tutu = createEntity(em);
    }

    @Test
    @Transactional
    public void createTutu() throws Exception {
        int databaseSizeBeforeCreate = tutuRepository.findAll().size();

        // Create the Tutu
        restTutuMockMvc.perform(post("/api/tutus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tutu)))
            .andExpect(status().isCreated());

        // Validate the Tutu in the database
        List<Tutu> tutuList = tutuRepository.findAll();
        assertThat(tutuList).hasSize(databaseSizeBeforeCreate + 1);
        Tutu testTutu = tutuList.get(tutuList.size() - 1);
        assertThat(testTutu.getDate()).isEqualTo(DEFAULT_DATE);

        // Validate the Tutu in Elasticsearch
        Tutu tutuEs = tutuSearchRepository.findOne(testTutu.getId());
        assertThat(tutuEs).isEqualToIgnoringGivenFields(testTutu);
    }

    @Test
    @Transactional
    public void createTutuWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tutuRepository.findAll().size();

        // Create the Tutu with an existing ID
        tutu.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTutuMockMvc.perform(post("/api/tutus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tutu)))
            .andExpect(status().isBadRequest());

        // Validate the Tutu in the database
        List<Tutu> tutuList = tutuRepository.findAll();
        assertThat(tutuList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllTutus() throws Exception {
        // Initialize the database
        tutuRepository.saveAndFlush(tutu);

        // Get all the tutuList
        restTutuMockMvc.perform(get("/api/tutus?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tutu.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    public void getTutu() throws Exception {
        // Initialize the database
        tutuRepository.saveAndFlush(tutu);

        // Get the tutu
        restTutuMockMvc.perform(get("/api/tutus/{id}", tutu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tutu.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTutu() throws Exception {
        // Get the tutu
        restTutuMockMvc.perform(get("/api/tutus/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTutu() throws Exception {
        // Initialize the database
        tutuRepository.saveAndFlush(tutu);
        tutuSearchRepository.save(tutu);
        int databaseSizeBeforeUpdate = tutuRepository.findAll().size();

        // Update the tutu
        Tutu updatedTutu = tutuRepository.findOne(tutu.getId());
        // Disconnect from session so that the updates on updatedTutu are not directly saved in db
        em.detach(updatedTutu);
        updatedTutu
            .date(UPDATED_DATE);

        restTutuMockMvc.perform(put("/api/tutus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTutu)))
            .andExpect(status().isOk());

        // Validate the Tutu in the database
        List<Tutu> tutuList = tutuRepository.findAll();
        assertThat(tutuList).hasSize(databaseSizeBeforeUpdate);
        Tutu testTutu = tutuList.get(tutuList.size() - 1);
        assertThat(testTutu.getDate()).isEqualTo(UPDATED_DATE);

        // Validate the Tutu in Elasticsearch
        Tutu tutuEs = tutuSearchRepository.findOne(testTutu.getId());
        assertThat(tutuEs).isEqualToIgnoringGivenFields(testTutu);
    }

    @Test
    @Transactional
    public void updateNonExistingTutu() throws Exception {
        int databaseSizeBeforeUpdate = tutuRepository.findAll().size();

        // Create the Tutu

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTutuMockMvc.perform(put("/api/tutus")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tutu)))
            .andExpect(status().isCreated());

        // Validate the Tutu in the database
        List<Tutu> tutuList = tutuRepository.findAll();
        assertThat(tutuList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteTutu() throws Exception {
        // Initialize the database
        tutuRepository.saveAndFlush(tutu);
        tutuSearchRepository.save(tutu);
        int databaseSizeBeforeDelete = tutuRepository.findAll().size();

        // Get the tutu
        restTutuMockMvc.perform(delete("/api/tutus/{id}", tutu.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean tutuExistsInEs = tutuSearchRepository.exists(tutu.getId());
        assertThat(tutuExistsInEs).isFalse();

        // Validate the database is empty
        List<Tutu> tutuList = tutuRepository.findAll();
        assertThat(tutuList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchTutu() throws Exception {
        // Initialize the database
        tutuRepository.saveAndFlush(tutu);
        tutuSearchRepository.save(tutu);

        // Search the tutu
        restTutuMockMvc.perform(get("/api/_search/tutus?query=id:" + tutu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tutu.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tutu.class);
        Tutu tutu1 = new Tutu();
        tutu1.setId(1L);
        Tutu tutu2 = new Tutu();
        tutu2.setId(tutu1.getId());
        assertThat(tutu1).isEqualTo(tutu2);
        tutu2.setId(2L);
        assertThat(tutu1).isNotEqualTo(tutu2);
        tutu1.setId(null);
        assertThat(tutu1).isNotEqualTo(tutu2);
    }
}
