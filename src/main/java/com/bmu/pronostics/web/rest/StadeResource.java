package com.bmu.pronostics.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bmu.pronostics.domain.Stade;

import com.bmu.pronostics.repository.StadeRepository;
import com.bmu.pronostics.repository.search.StadeSearchRepository;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;
import com.bmu.pronostics.web.rest.util.HeaderUtil;
import com.bmu.pronostics.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
 * REST controller for managing Stade.
 */
@RestController
@RequestMapping("/api")
public class StadeResource {

    private final Logger log = LoggerFactory.getLogger(StadeResource.class);

    private static final String ENTITY_NAME = "stade";

    private final StadeRepository stadeRepository;

    private final StadeSearchRepository stadeSearchRepository;

    public StadeResource(StadeRepository stadeRepository, StadeSearchRepository stadeSearchRepository) {
        this.stadeRepository = stadeRepository;
        this.stadeSearchRepository = stadeSearchRepository;
    }

    /**
     * POST  /stades : Create a new stade.
     *
     * @param stade the stade to create
     * @return the ResponseEntity with status 201 (Created) and with body the new stade, or with status 400 (Bad Request) if the stade has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/stades")
    @Timed
    public ResponseEntity<Stade> createStade(@Valid @RequestBody Stade stade) throws URISyntaxException {
        log.debug("REST request to save Stade : {}", stade);
        if (stade.getId() != null) {
            throw new BadRequestAlertException("A new stade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stade result = stadeRepository.save(stade);
        stadeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/stades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /stades : Updates an existing stade.
     *
     * @param stade the stade to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated stade,
     * or with status 400 (Bad Request) if the stade is not valid,
     * or with status 500 (Internal Server Error) if the stade couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/stades")
    @Timed
    public ResponseEntity<Stade> updateStade(@Valid @RequestBody Stade stade) throws URISyntaxException {
        log.debug("REST request to update Stade : {}", stade);
        if (stade.getId() == null) {
            return createStade(stade);
        }
        Stade result = stadeRepository.save(stade);
        stadeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, stade.getId().toString()))
            .body(result);
    }

    /**
     * GET  /stades : get all the stades.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of stades in body
     */
    @GetMapping("/stades")
    @Timed
    public ResponseEntity<List<Stade>> getAllStades(Pageable pageable) {
        log.debug("REST request to get a page of Stades");
        Page<Stade> page = stadeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/stades");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /stades/:id : get the "id" stade.
     *
     * @param id the id of the stade to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the stade, or with status 404 (Not Found)
     */
    @GetMapping("/stades/{id}")
    @Timed
    public ResponseEntity<Stade> getStade(@PathVariable Long id) {
        log.debug("REST request to get Stade : {}", id);
        Stade stade = stadeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(stade));
    }

    /**
     * DELETE  /stades/:id : delete the "id" stade.
     *
     * @param id the id of the stade to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/stades/{id}")
    @Timed
    public ResponseEntity<Void> deleteStade(@PathVariable Long id) {
        log.debug("REST request to delete Stade : {}", id);
        stadeRepository.delete(id);
        stadeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/stades?query=:query : search for the stade corresponding
     * to the query.
     *
     * @param query the query of the stade search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/stades")
    @Timed
    public ResponseEntity<List<Stade>> searchStades(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Stades for query {}", query);
        Page<Stade> page = stadeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/stades");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
