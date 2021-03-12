package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;

import com.bmu.pronostics.domain.Equipe;
import com.bmu.pronostics.repository.EquipeRepository;
import com.bmu.pronostics.repository.search.EquipeSearchRepository;
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
 * Test class for the EquipeResource REST controller.
 *
 * @see EquipeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PronosticsApp.class)
public class EquipeResourceIntTest {

    private static final String DEFAULT_CODE_EQUIPE = "AAAAAAAAAA";
    private static final String UPDATED_CODE_EQUIPE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM_EQUIPE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_EQUIPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_RANG_FIFA = 1;
    private static final Integer UPDATED_RANG_FIFA = 2;

    private static final byte[] DEFAULT_ECUSSON = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ECUSSON = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_ECUSSON_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ECUSSON_CONTENT_TYPE = "image/png";

    @Autowired
    private EquipeRepository equipeRepository;

    @Autowired
    private EquipeSearchRepository equipeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEquipeMockMvc;

    private Equipe equipe;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EquipeResource equipeResource = new EquipeResource(equipeRepository, equipeSearchRepository);
        this.restEquipeMockMvc = MockMvcBuilders.standaloneSetup(equipeResource)
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
    public static Equipe createEntity(EntityManager em) {
        Equipe equipe = new Equipe()
            .codeEquipe(DEFAULT_CODE_EQUIPE)
            .nomEquipe(DEFAULT_NOM_EQUIPE)
            .rangFifa(DEFAULT_RANG_FIFA)
            .ecusson(DEFAULT_ECUSSON)
            .ecussonContentType(DEFAULT_ECUSSON_CONTENT_TYPE);
        return equipe;
    }

    @Before
    public void initTest() {
        equipeSearchRepository.deleteAll();
        equipe = createEntity(em);
    }

    @Test
    @Transactional
    public void createEquipe() throws Exception {
        int databaseSizeBeforeCreate = equipeRepository.findAll().size();

        // Create the Equipe
        restEquipeMockMvc.perform(post("/api/equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        Equipe equipeEs = equipeSearchRepository.findOne(testEquipe.getId());
        assertThat(equipeEs).isEqualToIgnoringGivenFields(testEquipe);
    }

    @Test
    @Transactional
    public void createEquipeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = equipeRepository.findAll().size();

        // Create the Equipe with an existing ID
        equipe.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEquipeMockMvc.perform(post("/api/equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(equipe)))
            .andExpect(status().isBadRequest());

        // Validate the Equipe in the database
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkEcussonIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipeRepository.findAll().size();
        // set the field null
        equipe.setEcusson(null);

        // Create the Equipe, which fails.

        restEquipeMockMvc.perform(post("/api/equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(equipe)))
            .andExpect(status().isBadRequest());

        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEquipes() throws Exception {
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);

        // Get all the equipeList
        restEquipeMockMvc.perform(get("/api/equipes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].codeEquipe").value(hasItem(DEFAULT_CODE_EQUIPE.toString())))
            .andExpect(jsonPath("$.[*].nomEquipe").value(hasItem(DEFAULT_NOM_EQUIPE.toString())))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(equipe.getId().intValue()))
            .andExpect(jsonPath("$.codeEquipe").value(DEFAULT_CODE_EQUIPE.toString()))
            .andExpect(jsonPath("$.nomEquipe").value(DEFAULT_NOM_EQUIPE.toString()))
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
        equipeSearchRepository.save(equipe);
        int databaseSizeBeforeUpdate = equipeRepository.findAll().size();

        // Update the equipe
        Equipe updatedEquipe = equipeRepository.findOne(equipe.getId());
        // Disconnect from session so that the updates on updatedEquipe are not directly saved in db
        em.detach(updatedEquipe);
        updatedEquipe
            .codeEquipe(UPDATED_CODE_EQUIPE)
            .nomEquipe(UPDATED_NOM_EQUIPE)
            .rangFifa(UPDATED_RANG_FIFA)
            .ecusson(UPDATED_ECUSSON)
            .ecussonContentType(UPDATED_ECUSSON_CONTENT_TYPE);

        restEquipeMockMvc.perform(put("/api/equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        Equipe equipeEs = equipeSearchRepository.findOne(testEquipe.getId());
        assertThat(equipeEs).isEqualToIgnoringGivenFields(testEquipe);
    }

    @Test
    @Transactional
    public void updateNonExistingEquipe() throws Exception {
        int databaseSizeBeforeUpdate = equipeRepository.findAll().size();

        // Create the Equipe

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEquipeMockMvc.perform(put("/api/equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(equipe)))
            .andExpect(status().isCreated());

        // Validate the Equipe in the database
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEquipe() throws Exception {
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);
        equipeSearchRepository.save(equipe);
        int databaseSizeBeforeDelete = equipeRepository.findAll().size();

        // Get the equipe
        restEquipeMockMvc.perform(delete("/api/equipes/{id}", equipe.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean equipeExistsInEs = equipeSearchRepository.exists(equipe.getId());
        assertThat(equipeExistsInEs).isFalse();

        // Validate the database is empty
        List<Equipe> equipeList = equipeRepository.findAll();
        assertThat(equipeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchEquipe() throws Exception {
        // Initialize the database
        equipeRepository.saveAndFlush(equipe);
        equipeSearchRepository.save(equipe);

        // Search the equipe
        restEquipeMockMvc.perform(get("/api/_search/equipes?query=id:" + equipe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].codeEquipe").value(hasItem(DEFAULT_CODE_EQUIPE.toString())))
            .andExpect(jsonPath("$.[*].nomEquipe").value(hasItem(DEFAULT_NOM_EQUIPE.toString())))
            .andExpect(jsonPath("$.[*].rangFifa").value(hasItem(DEFAULT_RANG_FIFA)))
            .andExpect(jsonPath("$.[*].ecussonContentType").value(hasItem(DEFAULT_ECUSSON_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].ecusson").value(hasItem(Base64Utils.encodeToString(DEFAULT_ECUSSON))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Equipe.class);
        Equipe equipe1 = new Equipe();
        equipe1.setId(1L);
        Equipe equipe2 = new Equipe();
        equipe2.setId(equipe1.getId());
        assertThat(equipe1).isEqualTo(equipe2);
        equipe2.setId(2L);
        assertThat(equipe1).isNotEqualTo(equipe2);
        equipe1.setId(null);
        assertThat(equipe1).isNotEqualTo(equipe2);
    }
}
