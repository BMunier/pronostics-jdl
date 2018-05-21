package com.bmu.pronostics.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bmu.pronostics.domain.Competition;

import com.bmu.pronostics.repository.CompetitionRepository;
import com.bmu.pronostics.repository.search.CompetitionSearchRepository;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;
import com.bmu.pronostics.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
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
 * REST controller for managing Competition.
 */
@RestController
@RequestMapping("/api")
public class CompetitionResource {

    private final Logger log = LoggerFactory.getLogger(CompetitionResource.class);

    private static final String ENTITY_NAME = "competition";

    private final CompetitionRepository competitionRepository;

    private final CompetitionSearchRepository competitionSearchRepository;

    public CompetitionResource(CompetitionRepository competitionRepository, CompetitionSearchRepository competitionSearchRepository) {
        this.competitionRepository = competitionRepository;
        this.competitionSearchRepository = competitionSearchRepository;
    }

    /**
     * POST  /competitions : Create a new competition.
     *
     * @param competition the competition to create
     * @return the ResponseEntity with status 201 (Created) and with body the new competition, or with status 400 (Bad Request) if the competition has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/competitions")
    @Timed
    public ResponseEntity<Competition> createCompetition(@Valid @RequestBody Competition competition) throws URISyntaxException {
        log.debug("REST request to save Competition : {}", competition);
        if (competition.getId() != null) {
            throw new BadRequestAlertException("A new competition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Competition result = competitionRepository.save(competition);
        competitionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/competitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /competitions : Updates an existing competition.
     *
     * @param competition the competition to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated competition,
     * or with status 400 (Bad Request) if the competition is not valid,
     * or with status 500 (Internal Server Error) if the competition couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/competitions")
    @Timed
    public ResponseEntity<Competition> updateCompetition(@Valid @RequestBody Competition competition) throws URISyntaxException {
        log.debug("REST request to update Competition : {}", competition);
        if (competition.getId() == null) {
            return createCompetition(competition);
        }
        Competition result = competitionRepository.save(competition);
        competitionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, competition.getId().toString()))
            .body(result);
    }

    /**
     * GET  /competitions : get all the competitions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of competitions in body
     */
    @GetMapping("/competitions")
    @Timed
    public List<Competition> getAllCompetitions() {
        log.debug("REST request to get all Competitions");
        return competitionRepository.findAll();
        }

    /**
     * GET  /competitions/:id : get the "id" competition.
     *
     * @param id the id of the competition to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the competition, or with status 404 (Not Found)
     */
    @GetMapping("/competitions/{id}")
    @Timed
    public ResponseEntity<Competition> getCompetition(@PathVariable Long id) {
        log.debug("REST request to get Competition : {}", id);
        Competition competition = competitionRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(competition));
    }

    /**
     * DELETE  /competitions/:id : delete the "id" competition.
     *
     * @param id the id of the competition to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/competitions/{id}")
    @Timed
    public ResponseEntity<Void> deleteCompetition(@PathVariable Long id) {
        log.debug("REST request to delete Competition : {}", id);
        competitionRepository.delete(id);
        competitionSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/competitions?query=:query : search for the competition corresponding
     * to the query.
     *
     * @param query the query of the competition search
     * @return the result of the search
     */
    @GetMapping("/_search/competitions")
    @Timed
    public List<Competition> searchCompetitions(@RequestParam String query) {
        log.debug("REST request to search Competitions for query {}", query);
        return StreamSupport
            .stream(competitionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
