package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.PronosticsApp;
import com.bmu.pronostics.domain.Match;
import com.bmu.pronostics.repository.MatchRepository;
import com.bmu.pronostics.repository.PronosticRepository;
import com.bmu.pronostics.repository.search.MatchSearchRepository;

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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bmu.pronostics.domain.enumeration.StatutMatch;
import com.bmu.pronostics.domain.enumeration.PhaseCompetition;
/**
 * Integration tests for the {@link MatchResource} REST controller.
 */
@SpringBootTest(classes = PronosticsApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class MatchResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final StatutMatch DEFAULT_STATUT = StatutMatch.PAS_DEMARRE;
    private static final StatutMatch UPDATED_STATUT = StatutMatch.EN_COURS;

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Integer DEFAULT_SCORE_EQUIPE_DOMICILE = 1;
    private static final Integer UPDATED_SCORE_EQUIPE_DOMICILE = 2;

    private static final Integer DEFAULT_SCORE_EQUIPE_VISITEUR = 1;
    private static final Integer UPDATED_SCORE_EQUIPE_VISITEUR = 2;

    private static final PhaseCompetition DEFAULT_PHASE_COMPETITION = PhaseCompetition.GROUPE;
    private static final PhaseCompetition UPDATED_PHASE_COMPETITION = PhaseCompetition.HUITIEME;

    private static final String DEFAULT_GROUPE = "AAAAAAAAAA";
    private static final String UPDATED_GROUPE = "BBBBBBBBBB";

    @Autowired
    private MatchRepository matchRepository;

    /**
     * This repository is mocked in the com.bmu.pronostics.repository.search test package.
     *
     * @see com.bmu.pronostics.repository.search.MatchSearchRepositoryMockConfiguration
     */
    @Autowired
    private MatchSearchRepository mockMatchSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMatchMockMvc;

    private Match match;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Match createEntity(EntityManager em) {
        Match match = new Match()
            .date(DEFAULT_DATE)
            .statut(DEFAULT_STATUT)
            .code(DEFAULT_CODE)
            .scoreEquipeDomicile(DEFAULT_SCORE_EQUIPE_DOMICILE)
            .scoreEquipeVisiteur(DEFAULT_SCORE_EQUIPE_VISITEUR)
            .phaseCompetition(DEFAULT_PHASE_COMPETITION)
            .groupe(DEFAULT_GROUPE);
        return match;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Match createUpdatedEntity(EntityManager em) {
        Match match = new Match()
            .date(UPDATED_DATE)
            .statut(UPDATED_STATUT)
            .code(UPDATED_CODE)
            .scoreEquipeDomicile(UPDATED_SCORE_EQUIPE_DOMICILE)
            .scoreEquipeVisiteur(UPDATED_SCORE_EQUIPE_VISITEUR)
            .phaseCompetition(UPDATED_PHASE_COMPETITION)
            .groupe(UPDATED_GROUPE);
        return match;
    }

    @BeforeEach
    public void initTest() {
        match = createEntity(em);
    }

    @Test
    @Transactional
    public void createMatch() throws Exception {
        int databaseSizeBeforeCreate = matchRepository.findAll().size();
        // Create the Match
        restMatchMockMvc.perform(post("/api/matches").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isCreated());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeCreate + 1);
        Match testMatch = matchList.get(matchList.size() - 1);
        assertThat(testMatch.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMatch.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testMatch.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testMatch.getScoreEquipeDomicile()).isEqualTo(DEFAULT_SCORE_EQUIPE_DOMICILE);
        assertThat(testMatch.getScoreEquipeVisiteur()).isEqualTo(DEFAULT_SCORE_EQUIPE_VISITEUR);
        assertThat(testMatch.getPhaseCompetition()).isEqualTo(DEFAULT_PHASE_COMPETITION);
        assertThat(testMatch.getGroupe()).isEqualTo(DEFAULT_GROUPE);

        // Validate the Match in Elasticsearch
        verify(mockMatchSearchRepository, times(1)).save(testMatch);
    }

    @Test
    @Transactional
    public void createMatchWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = matchRepository.findAll().size();

        // Create the Match with an existing ID
        match.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMatchMockMvc.perform(post("/api/matches").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isBadRequest());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeCreate);

        // Validate the Match in Elasticsearch
        verify(mockMatchSearchRepository, times(0)).save(match);
    }


    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = matchRepository.findAll().size();
        // set the field null
        match.setDate(null);

        // Create the Match, which fails.


        restMatchMockMvc.perform(post("/api/matches").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isBadRequest());

        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatutIsRequired() throws Exception {
        int databaseSizeBeforeTest = matchRepository.findAll().size();
        // set the field null
        match.setStatut(null);

        // Create the Match, which fails.


        restMatchMockMvc.perform(post("/api/matches").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isBadRequest());

        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMatches() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        // Get all the matchList
        restMatchMockMvc.perform(get("/api/matches?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(match.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].scoreEquipeDomicile").value(hasItem(DEFAULT_SCORE_EQUIPE_DOMICILE)))
            .andExpect(jsonPath("$.[*].scoreEquipeVisiteur").value(hasItem(DEFAULT_SCORE_EQUIPE_VISITEUR)))
            .andExpect(jsonPath("$.[*].phaseCompetition").value(hasItem(DEFAULT_PHASE_COMPETITION.toString())))
            .andExpect(jsonPath("$.[*].groupe").value(hasItem(DEFAULT_GROUPE)));
    }

    @Test
    @Transactional
    public void getMatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        // Get the match
        restMatchMockMvc.perform(get("/api/matches/{id}", match.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(match.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.scoreEquipeDomicile").value(DEFAULT_SCORE_EQUIPE_DOMICILE))
            .andExpect(jsonPath("$.scoreEquipeVisiteur").value(DEFAULT_SCORE_EQUIPE_VISITEUR))
            .andExpect(jsonPath("$.phaseCompetition").value(DEFAULT_PHASE_COMPETITION.toString()))
            .andExpect(jsonPath("$.groupe").value(DEFAULT_GROUPE));
    }
    @Test
    @Transactional
    public void getNonExistingMatch() throws Exception {
        // Get the match
        restMatchMockMvc.perform(get("/api/matches/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        int databaseSizeBeforeUpdate = matchRepository.findAll().size();

        // Update the match
        Match updatedMatch = matchRepository.findById(match.getId()).get();
        // Disconnect from session so that the updates on updatedMatch are not directly saved in db
        em.detach(updatedMatch);
        updatedMatch
            .date(UPDATED_DATE)
            .statut(UPDATED_STATUT)
            .code(UPDATED_CODE)
            .scoreEquipeDomicile(UPDATED_SCORE_EQUIPE_DOMICILE)
            .scoreEquipeVisiteur(UPDATED_SCORE_EQUIPE_VISITEUR)
            .phaseCompetition(UPDATED_PHASE_COMPETITION)
            .groupe(UPDATED_GROUPE);

        restMatchMockMvc.perform(put("/api/matches").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedMatch)))
            .andExpect(status().isOk());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
        Match testMatch = matchList.get(matchList.size() - 1);
        assertThat(testMatch.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMatch.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testMatch.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testMatch.getScoreEquipeDomicile()).isEqualTo(UPDATED_SCORE_EQUIPE_DOMICILE);
        assertThat(testMatch.getScoreEquipeVisiteur()).isEqualTo(UPDATED_SCORE_EQUIPE_VISITEUR);
        assertThat(testMatch.getPhaseCompetition()).isEqualTo(UPDATED_PHASE_COMPETITION);
        assertThat(testMatch.getGroupe()).isEqualTo(UPDATED_GROUPE);

        // Validate the Match in Elasticsearch
        verify(mockMatchSearchRepository, times(1)).save(testMatch);
    }

    @Test
    @Transactional
    public void updateNonExistingMatch() throws Exception {
        int databaseSizeBeforeUpdate = matchRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatchMockMvc.perform(put("/api/matches").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isBadRequest());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Match in Elasticsearch
        verify(mockMatchSearchRepository, times(0)).save(match);
    }

    @Test
    @Transactional
    public void deleteMatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        int databaseSizeBeforeDelete = matchRepository.findAll().size();

        // Delete the match
        restMatchMockMvc.perform(delete("/api/matches/{id}", match.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Match in Elasticsearch
        verify(mockMatchSearchRepository, times(1)).deleteById(match.getId());
    }

    @Test
    @Transactional
    public void searchMatch() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        matchRepository.saveAndFlush(match);
        when(mockMatchSearchRepository.search(queryStringQuery("id:" + match.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(match), PageRequest.of(0, 1), 1));

        // Search the match
        restMatchMockMvc.perform(get("/api/_search/matches?query=id:" + match.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(match.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].scoreEquipeDomicile").value(hasItem(DEFAULT_SCORE_EQUIPE_DOMICILE)))
            .andExpect(jsonPath("$.[*].scoreEquipeVisiteur").value(hasItem(DEFAULT_SCORE_EQUIPE_VISITEUR)))
            .andExpect(jsonPath("$.[*].phaseCompetition").value(hasItem(DEFAULT_PHASE_COMPETITION.toString())))
            .andExpect(jsonPath("$.[*].groupe").value(hasItem(DEFAULT_GROUPE)));
    }
}
