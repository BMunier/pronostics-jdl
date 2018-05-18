package com.bmu.pronostics.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bmu.pronostics.domain.Tutu;

import com.bmu.pronostics.repository.TutuRepository;
import com.bmu.pronostics.repository.search.TutuSearchRepository;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;
import com.bmu.pronostics.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Tutu.
 */
@RestController
@RequestMapping("/api")
public class TutuResource {

    private final Logger log = LoggerFactory.getLogger(TutuResource.class);

    private static final String ENTITY_NAME = "tutu";

    private final TutuRepository tutuRepository;

    private final TutuSearchRepository tutuSearchRepository;

    public TutuResource(TutuRepository tutuRepository, TutuSearchRepository tutuSearchRepository) {
        this.tutuRepository = tutuRepository;
        this.tutuSearchRepository = tutuSearchRepository;
    }

    /**
     * POST  /tutus : Create a new tutu.
     *
     * @param tutu the tutu to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tutu, or with status 400 (Bad Request) if the tutu has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tutus")
    @Timed
    public ResponseEntity<Tutu> createTutu(@RequestBody Tutu tutu) throws URISyntaxException {
        log.debug("REST request to save Tutu : {}", tutu);
        if (tutu.getId() != null) {
            throw new BadRequestAlertException("A new tutu cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tutu result = tutuRepository.save(tutu);
        tutuSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tutus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tutus : Updates an existing tutu.
     *
     * @param tutu the tutu to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tutu,
     * or with status 400 (Bad Request) if the tutu is not valid,
     * or with status 500 (Internal Server Error) if the tutu couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tutus")
    @Timed
    public ResponseEntity<Tutu> updateTutu(@RequestBody Tutu tutu) throws URISyntaxException {
        log.debug("REST request to update Tutu : {}", tutu);
        if (tutu.getId() == null) {
            return createTutu(tutu);
        }
        Tutu result = tutuRepository.save(tutu);
        tutuSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tutu.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tutus : get all the tutus.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of tutus in body
     */
    @GetMapping("/tutus")
    @Timed
    public List<Tutu> getAllTutus() {
        log.debug("REST request to get all Tutus");
        return tutuRepository.findAll();
        }

    /**
     * GET  /tutus/:id : get the "id" tutu.
     *
     * @param id the id of the tutu to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tutu, or with status 404 (Not Found)
     */
    @GetMapping("/tutus/{id}")
    @Timed
    public ResponseEntity<Tutu> getTutu(@PathVariable Long id) {
        log.debug("REST request to get Tutu : {}", id);
        Tutu tutu = tutuRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tutu));
    }

    /**
     * DELETE  /tutus/:id : delete the "id" tutu.
     *
     * @param id the id of the tutu to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tutus/{id}")
    @Timed
    public ResponseEntity<Void> deleteTutu(@PathVariable Long id) {
        log.debug("REST request to delete Tutu : {}", id);
        tutuRepository.delete(id);
        tutuSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tutus?query=:query : search for the tutu corresponding
     * to the query.
     *
     * @param query the query of the tutu search
     * @return the result of the search
     */
    @GetMapping("/_search/tutus")
    @Timed
    public List<Tutu> searchTutus(@RequestParam String query) {
        log.debug("REST request to search Tutus for query {}", query);
        return StreamSupport
            .stream(tutuSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
