package com.bmu.pronostics.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bmu.pronostics.domain.Toto;

import com.bmu.pronostics.repository.TotoRepository;
import com.bmu.pronostics.repository.search.TotoSearchRepository;
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
 * REST controller for managing Toto.
 */
@RestController
@RequestMapping("/api")
public class TotoResource {

    private final Logger log = LoggerFactory.getLogger(TotoResource.class);

    private static final String ENTITY_NAME = "toto";

    private final TotoRepository totoRepository;

    private final TotoSearchRepository totoSearchRepository;

    public TotoResource(TotoRepository totoRepository, TotoSearchRepository totoSearchRepository) {
        this.totoRepository = totoRepository;
        this.totoSearchRepository = totoSearchRepository;
    }

    /**
     * POST  /totos : Create a new toto.
     *
     * @param toto the toto to create
     * @return the ResponseEntity with status 201 (Created) and with body the new toto, or with status 400 (Bad Request) if the toto has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/totos")
    @Timed
    public ResponseEntity<Toto> createToto(@Valid @RequestBody Toto toto) throws URISyntaxException {
        log.debug("REST request to save Toto : {}", toto);
        if (toto.getId() != null) {
            throw new BadRequestAlertException("A new toto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Toto result = totoRepository.save(toto);
        totoSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/totos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /totos : Updates an existing toto.
     *
     * @param toto the toto to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated toto,
     * or with status 400 (Bad Request) if the toto is not valid,
     * or with status 500 (Internal Server Error) if the toto couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/totos")
    @Timed
    public ResponseEntity<Toto> updateToto(@Valid @RequestBody Toto toto) throws URISyntaxException {
        log.debug("REST request to update Toto : {}", toto);
        if (toto.getId() == null) {
            return createToto(toto);
        }
        Toto result = totoRepository.save(toto);
        totoSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, toto.getId().toString()))
            .body(result);
    }

    /**
     * GET  /totos : get all the totos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of totos in body
     */
    @GetMapping("/totos")
    @Timed
    public List<Toto> getAllTotos() {
        log.debug("REST request to get all Totos");
        return totoRepository.findAll();
        }

    /**
     * GET  /totos/:id : get the "id" toto.
     *
     * @param id the id of the toto to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the toto, or with status 404 (Not Found)
     */
    @GetMapping("/totos/{id}")
    @Timed
    public ResponseEntity<Toto> getToto(@PathVariable Long id) {
        log.debug("REST request to get Toto : {}", id);
        Toto toto = totoRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(toto));
    }

    /**
     * DELETE  /totos/:id : delete the "id" toto.
     *
     * @param id the id of the toto to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/totos/{id}")
    @Timed
    public ResponseEntity<Void> deleteToto(@PathVariable Long id) {
        log.debug("REST request to delete Toto : {}", id);
        totoRepository.delete(id);
        totoSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/totos?query=:query : search for the toto corresponding
     * to the query.
     *
     * @param query the query of the toto search
     * @return the result of the search
     */
    @GetMapping("/_search/totos")
    @Timed
    public List<Toto> searchTotos(@RequestParam String query) {
        log.debug("REST request to search Totos for query {}", query);
        return StreamSupport
            .stream(totoSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
