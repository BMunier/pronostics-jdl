package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.domain.Stade;
import com.bmu.pronostics.repository.StadeRepository;
import com.bmu.pronostics.repository.search.StadeSearchRepository;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
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
 * REST controller for managing {@link com.bmu.pronostics.domain.Stade}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StadeResource {

    private final Logger log = LoggerFactory.getLogger(StadeResource.class);

    private static final String ENTITY_NAME = "stade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StadeRepository stadeRepository;

    private final StadeSearchRepository stadeSearchRepository;

    public StadeResource(StadeRepository stadeRepository, StadeSearchRepository stadeSearchRepository) {
        this.stadeRepository = stadeRepository;
        this.stadeSearchRepository = stadeSearchRepository;
    }

    /**
     * {@code POST  /stades} : Create a new stade.
     *
     * @param stade the stade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stade, or with status {@code 400 (Bad Request)} if the stade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stades")
    public ResponseEntity<Stade> createStade(@Valid @RequestBody Stade stade) throws URISyntaxException {
        log.debug("REST request to save Stade : {}", stade);
        if (stade.getId() != null) {
            throw new BadRequestAlertException("A new stade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stade result = stadeRepository.save(stade);
        stadeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/stades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stades} : Updates an existing stade.
     *
     * @param stade the stade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stade,
     * or with status {@code 400 (Bad Request)} if the stade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stades")
    public ResponseEntity<Stade> updateStade(@Valid @RequestBody Stade stade) throws URISyntaxException {
        log.debug("REST request to update Stade : {}", stade);
        if (stade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Stade result = stadeRepository.save(stade);
        stadeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stade.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /stades} : get all the stades.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stades in body.
     */
    @GetMapping("/stades")
    public ResponseEntity<List<Stade>> getAllStades(Pageable pageable) {
        log.debug("REST request to get a page of Stades");
        Page<Stade> page = stadeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /stades/:id} : get the "id" stade.
     *
     * @param id the id of the stade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stades/{id}")
    public ResponseEntity<Stade> getStade(@PathVariable Long id) {
        log.debug("REST request to get Stade : {}", id);
        Optional<Stade> stade = stadeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stade);
    }

    /**
     * {@code DELETE  /stades/:id} : delete the "id" stade.
     *
     * @param id the id of the stade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stades/{id}")
    public ResponseEntity<Void> deleteStade(@PathVariable Long id) {
        log.debug("REST request to delete Stade : {}", id);
        stadeRepository.deleteById(id);
        stadeSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/stades?query=:query} : search for the stade corresponding
     * to the query.
     *
     * @param query the query of the stade search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/stades")
    public ResponseEntity<List<Stade>> searchStades(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Stades for query {}", query);
        Page<Stade> page = stadeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
}
