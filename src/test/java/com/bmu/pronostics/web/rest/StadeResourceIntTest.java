package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;

import com.bmu.pronostics.domain.Stade;
import com.bmu.pronostics.repository.StadeRepository;
import com.bmu.pronostics.repository.search.StadeSearchRepository;
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
 * Test class for the StadeResource REST controller.
 *
 * @see StadeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PronosticsApp.class)
public class StadeResourceIntTest {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_VILLE = "AAAAAAAAAA";
    private static final String UPDATED_VILLE = "BBBBBBBBBB";

    @Autowired
    private StadeRepository stadeRepository;

    @Autowired
    private StadeSearchRepository stadeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restStadeMockMvc;

    private Stade stade;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final StadeResource stadeResource = new StadeResource(stadeRepository, stadeSearchRepository);
        this.restStadeMockMvc = MockMvcBuilders.standaloneSetup(stadeResource)
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
    public static Stade createEntity(EntityManager em) {
        Stade stade = new Stade()
            .nom(DEFAULT_NOM)
            .ville(DEFAULT_VILLE);
        return stade;
    }

    @Before
    public void initTest() {
        stadeSearchRepository.deleteAll();
        stade = createEntity(em);
    }

    @Test
    @Transactional
    public void createStade() throws Exception {
        int databaseSizeBeforeCreate = stadeRepository.findAll().size();

        // Create the Stade
        restStadeMockMvc.perform(post("/api/stades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isCreated());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate + 1);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testStade.getVille()).isEqualTo(DEFAULT_VILLE);

        // Validate the Stade in Elasticsearch
        Stade stadeEs = stadeSearchRepository.findOne(testStade.getId());
        assertThat(stadeEs).isEqualToIgnoringGivenFields(testStade);
    }

    @Test
    @Transactional
    public void createStadeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = stadeRepository.findAll().size();

        // Create the Stade with an existing ID
        stade.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStadeMockMvc.perform(post("/api/stades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = stadeRepository.findAll().size();
        // set the field null
        stade.setNom(null);

        // Create the Stade, which fails.

        restStadeMockMvc.perform(post("/api/stades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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

        restStadeMockMvc.perform(post("/api/stades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].ville").value(hasItem(DEFAULT_VILLE.toString())));
    }

    @Test
    @Transactional
    public void getStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        // Get the stade
        restStadeMockMvc.perform(get("/api/stades/{id}", stade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(stade.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM.toString()))
            .andExpect(jsonPath("$.ville").value(DEFAULT_VILLE.toString()));
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
        stadeSearchRepository.save(stade);
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade
        Stade updatedStade = stadeRepository.findOne(stade.getId());
        // Disconnect from session so that the updates on updatedStade are not directly saved in db
        em.detach(updatedStade);
        updatedStade
            .nom(UPDATED_NOM)
            .ville(UPDATED_VILLE);

        restStadeMockMvc.perform(put("/api/stades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedStade)))
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testStade.getVille()).isEqualTo(UPDATED_VILLE);

        // Validate the Stade in Elasticsearch
        Stade stadeEs = stadeSearchRepository.findOne(testStade.getId());
        assertThat(stadeEs).isEqualToIgnoringGivenFields(testStade);
    }

    @Test
    @Transactional
    public void updateNonExistingStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Create the Stade

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restStadeMockMvc.perform(put("/api/stades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isCreated());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);
        stadeSearchRepository.save(stade);
        int databaseSizeBeforeDelete = stadeRepository.findAll().size();

        // Get the stade
        restStadeMockMvc.perform(delete("/api/stades/{id}", stade.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean stadeExistsInEs = stadeSearchRepository.exists(stade.getId());
        assertThat(stadeExistsInEs).isFalse();

        // Validate the database is empty
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);
        stadeSearchRepository.save(stade);

        // Search the stade
        restStadeMockMvc.perform(get("/api/_search/stades?query=id:" + stade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM.toString())))
            .andExpect(jsonPath("$.[*].ville").value(hasItem(DEFAULT_VILLE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stade.class);
        Stade stade1 = new Stade();
        stade1.setId(1L);
        Stade stade2 = new Stade();
        stade2.setId(stade1.getId());
        assertThat(stade1).isEqualTo(stade2);
        stade2.setId(2L);
        assertThat(stade1).isNotEqualTo(stade2);
        stade1.setId(null);
        assertThat(stade1).isNotEqualTo(stade2);
    }
}
