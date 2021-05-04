package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.domain.Match;
import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.domain.enumeration.StatutMatch;
import com.bmu.pronostics.repository.MatchRepository;
import com.bmu.pronostics.repository.PronosticRepository;
import com.bmu.pronostics.repository.search.MatchSearchRepository;
import com.bmu.pronostics.repository.search.PronosticSearchRepository;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.bmu.pronostics.domain.Match}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MatchResource {

    private final Logger log = LoggerFactory.getLogger(MatchResource.class);

    private static final String ENTITY_NAME = "match";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

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
     * {@code POST  /matches} : Create a new match.
     *
     * @param match the match to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new match, or with status {@code 400 (Bad Request)} if the match has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/matches")
    public ResponseEntity<Match> createMatch(@Valid @RequestBody Match match) throws URISyntaxException {
        log.debug("REST request to save Match : {}", match);
        if (match.getId() != null) {
            throw new BadRequestAlertException("A new match cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Match result = matchRepository.save(match);
        matchSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/matches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /matches} : Updates an existing match.
     *
     * @param match the match to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated match,
     * or with status {@code 400 (Bad Request)} if the match is not valid,
     * or with status {@code 500 (Internal Server Error)} if the match couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/matches")
    public ResponseEntity<Match> updateMatch(@Valid @RequestBody Match match) throws URISyntaxException {
        log.debug("REST request to update Match : {}", match);
        if (match.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Match result = matchRepository.save(match);
        matchSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, match.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /matches} : get all the matches.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matches in body.
     */
    @GetMapping("/matches")
    public ResponseEntity<List<Match>> getAllMatches(Pageable pageable) {
        log.debug("REST request to get a page of Matches");
        Page<Match> page = matchRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /matches/:id} : get the "id" match.
     *
     * @param id the id of the match to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the match, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/matches/{id}")
    public ResponseEntity<Match> getMatch(@PathVariable Long id) {
        log.debug("REST request to get Match : {}", id);
        Optional<Match> match = matchRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(match);
    }

    /**
     * {@code DELETE  /matches/:id} : delete the "id" match.
     *
     * @param id the id of the match to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/matches/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        log.debug("REST request to delete Match : {}", id);
        matchRepository.deleteById(id);
        matchSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/matches?query=:query} : search for the match corresponding
     * to the query.
     *
     * @param query the query of the match search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/matches")
    public ResponseEntity<List<Match>> searchMatches(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Matches for query {}", query);
        Page<Match> page = matchSearchRepository.search(queryStringQuery(query), pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
        }

    @PutMapping("/matches/refresh")
    @Timed
    public ResponseEntity<Void> refreshMatches() {
        log.debug("REST request to refresh Matches and Pronostics");
        Match matchTermine;
        Integer scoreDom, scoreVisit, scorePronoDom, scorePronoVisit, scoreDiffMatch;

        for (Pronostic pronostic : pronosticRepository.findAll()) {
            matchTermine = matchRepository.getOne(pronostic.getMatch().getId());
            if (matchTermine.getStatut().equals(StatutMatch.TERMINE)) {
                scoreDom = matchTermine.getScoreEquipeDomicile();
                scoreVisit = matchTermine.getScoreEquipeVisiteur();
                scorePronoDom = pronostic.getScoreEquipeDomicile();
                scorePronoVisit = pronostic.getScoreEquipeVisiteur();
                scoreDiffMatch = scoreDom - scoreVisit;
                switch (scoreDiffMatch.compareTo(scorePronoDom - scorePronoVisit)) {
                case WIN:
                if(((scoreDom > scoreVisit) && (scorePronoDom > scorePronoVisit)) ||  ((scoreDom < scoreVisit) && (scorePronoDom < scorePronoVisit)))  {
                    pronostic.setPoints(1);
                   }else{
                   pronostic.setPoints(0);
                   }
                    break;
                case DOUBLE_WIN:
                    if (scoreDom == scorePronoDom && scoreVisit == scorePronoVisit) {
                        pronostic.setPoints(3);
                    } else {
                        pronostic.setPoints(1);
                    }
                    break;
                case LOSE:
                    if((scoreDom > scoreVisit) && (scorePronoDom > scorePronoVisit) ||  (scoreDom < scoreVisit) && (scorePronoDom < scorePronoVisit))  {
                        pronostic.setPoints(1);
                    }else{
                        pronostic.setPoints(0);
                    }
                    break;
                }
                pronosticRepository.save(pronostic);
            }
        }

        return ResponseEntity.ok().headers(HeaderUtil.createAlert("pronosticsApp.pronostic.scoreUpdated", "", ""))
                .build();
    }

}
