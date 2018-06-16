package com.bmu.pronostics.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import com.bmu.pronostics.domain.Match;
import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.domain.enumeration.StatutMatch;
import com.bmu.pronostics.repository.MatchRepository;
import com.bmu.pronostics.repository.PronosticRepository;
import com.bmu.pronostics.repository.search.MatchSearchRepository;
import com.bmu.pronostics.repository.search.PronosticSearchRepository;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;
import com.bmu.pronostics.web.rest.errors.EmailAlreadyUsedException;
import com.bmu.pronostics.web.rest.util.HeaderUtil;
import com.bmu.pronostics.web.rest.util.PaginationUtil;
import com.codahale.metrics.annotation.Timed;

import org.hibernate.validator.constraints.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import afu.org.checkerframework.checker.units.qual.Time;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Match.
 */
@RestController
@RequestMapping("/api")
public class MatchResource {

    private final Logger log = LoggerFactory.getLogger(MatchResource.class);

    private static final String ENTITY_NAME = "match";

    private final MatchRepository matchRepository;

    private final MatchSearchRepository matchSearchRepository;

    private final PronosticRepository pronosticRepository;

    private final PronosticSearchRepository pronosticSearchRepository;

    private final int WIN = -1;

    private final int DOUBLE_WIN = 0;

    private final int LOSE = 1;

    public MatchResource(MatchRepository matchRepository, MatchSearchRepository matchSearchRepository,
            PronosticRepository pronosticRepository, PronosticSearchRepository pronosticSearchRepository) {
        this.matchRepository = matchRepository;
        this.matchSearchRepository = matchSearchRepository;
        this.pronosticRepository = pronosticRepository;
        this.pronosticSearchRepository = pronosticSearchRepository;
    }

    /**
     * POST /matches : Create a new match.
     *
     * @param match the match to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         match, or with status 400 (Bad Request) if the match has already an
     *         ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/matches")
    @Timed
    public ResponseEntity<Match> createMatch(@Valid @RequestBody Match match) throws URISyntaxException {
        log.debug("REST request to save Match : {}", match);
        if (match.getId() != null) {
            throw new BadRequestAlertException("A new match cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Match result = matchRepository.save(match);
        matchSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/matches/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * PUT /matches : Updates an existing match.
     *
     * @param match the match to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         match, or with status 400 (Bad Request) if the match is not valid, or
     *         with status 500 (Internal Server Error) if the match couldn't be
     *         updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/matches")
    @Timed
    public ResponseEntity<Match> updateMatch(@Valid @RequestBody Match match) throws URISyntaxException {
        log.debug("REST request to update Match : {}", match);
        if (match.getId() == null) {
            return createMatch(match);
        }
        Match result = matchRepository.save(match);
        matchSearchRepository.save(result);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, match.getId().toString()))
                .body(result);
    }

    /**
     * GET /matches : get all the matches.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of matches in
     *         body
     */
    @GetMapping("/matches")
    @Timed
    public ResponseEntity<List<Match>> getAllMatches(Pageable pageable) {
        log.debug("REST request to get a page of Matches");
        Page<Match> page = matchRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/matches");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET /matches/:id : get the "id" match.
     *
     * @param id the id of the match to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the match, or
     *         with status 404 (Not Found)
     */
    @GetMapping("/matches/{id}")
    @Timed
    public ResponseEntity<Match> getMatch(@PathVariable Long id) {
        log.debug("REST request to get Match : {}", id);
        Match match = matchRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(match));
    }

    /**
     * DELETE /matches/:id : delete the "id" match.
     *
     * @param id the id of the match to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/matches/{id}")
    @Timed
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        log.debug("REST request to delete Match : {}", id);
        matchRepository.delete(id);
        matchSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH /_search/matches?query=:query : search for the match corresponding to
     * the query.
     *
     * @param query    the query of the match search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/matches")
    @Timed
    public ResponseEntity<List<Match>> searchMatches(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Matches for query {}", query);
        Page<Match> page = matchSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/matches");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @PutMapping("/matches/refresh")
    @Time
    public ResponseEntity<Void> refreshMatches() {
        log.debug("REST request to refresh Matches and Pronostics");
        Match matchTermine;
        Integer scoreDom, scoreVisit, scorePronoDom, scorePronoVisit, scoreDiffMatch, matchTendance, pronoTendance;

        for (Pronostic pronostic : pronosticRepository.findAll()) {
            matchTermine = matchRepository.findOne(pronostic.getMatch().getId());
            if (matchTermine.getStatut().equals(StatutMatch.TERMINE)) {
                scoreDom = matchTermine.getScoreEquipeDomicile();
                scoreVisit = matchTermine.getScoreEquipeVisiteur();
                scorePronoDom = pronostic.getScoreEquipeDomicile();
                scorePronoVisit = pronostic.getScoreEquipeVisiteur();
                matchTendance = scoreDom.compareTo(scoreVisit);
                pronoTendance = scorePronoDom.compareTo(scorePronoVisit);
                if(matchTendance.equals(pronoTendance)){
                    if(scoreDom.equals(scorePronoDom) && scoreVisit.equals(scorePronoVisit)){
                        pronostic.setPoints(3);
                    }else{
                        pronostic.setPoints(1);
                    }
                }else{
                    pronostic.setPoints(0);
                }
               
                pronosticRepository.save(pronostic);
            }
        }
        
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("pronosticsApp.pronostic.scoreUpdated", null))
                .build();
    }

}