package com.bmu.pronostics.web.rest;

import com.bmu.pronostics.domain.Equipe;
import com.bmu.pronostics.repository.EquipeRepository;
import com.bmu.pronostics.repository.search.EquipeSearchRepository;
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
import org.springframework.data.web.PageableDefault;
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
 * REST controller for managing {@link com.bmu.pronostics.domain.Equipe}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EquipeResource {

    private final Logger log = LoggerFactory.getLogger(EquipeResource.class);

    private static final String ENTITY_NAME = "equipe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EquipeRepository equipeRepository;

    private final EquipeSearchRepository equipeSearchRepository;

    public EquipeResource(EquipeRepository equipeRepository, EquipeSearchRepository equipeSearchRepository) {
        this.equipeRepository = equipeRepository;
        this.equipeSearchRepository = equipeSearchRepository;
    }

    /**
     * {@code POST  /equipes} : Create a new equipe.
     *
     * @param equipe the equipe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new equipe, or with status {@code 400 (Bad Request)} if the equipe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/equipes")
    public ResponseEntity<Equipe> createEquipe(@Valid @RequestBody Equipe equipe) throws URISyntaxException {
        log.debug("REST request to save Equipe : {}", equipe);
        if (equipe.getId() != null) {
            throw new BadRequestAlertException("A new equipe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Equipe result = equipeRepository.save(equipe);
        equipeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/equipes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /equipes} : Updates an existing equipe.
     *
     * @param equipe the equipe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated equipe,
     * or with status {@code 400 (Bad Request)} if the equipe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the equipe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/equipes")
    public ResponseEntity<Equipe> updateEquipe(@Valid @RequestBody Equipe equipe) throws URISyntaxException {
        log.debug("REST request to update Equipe : {}", equipe);
        if (equipe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Equipe result = equipeRepository.save(equipe);
        equipeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, equipe.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /equipes} : get all the equipes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of equipes in body.
     */
    @GetMapping("/equipes")
    @Timed
    public ResponseEntity<List<Equipe>> getAllEquipes(Pageable pageable) {
        log.debug("REST request to get a page of Equipes");
        Page<Equipe> page = equipeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /equipes/:id} : get the "id" equipe.
     *
     * @param id the id of the equipe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the equipe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/equipes/{id}")
    public ResponseEntity<Equipe> getEquipe(@PathVariable Long id) {
        log.debug("REST request to get Equipe : {}", id);
        Optional<Equipe> equipe = equipeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(equipe);
    }

    /**
     * {@code DELETE  /equipes/:id} : delete the "id" equipe.
     *
     * @param id the id of the equipe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/equipes/{id}")
    public ResponseEntity<Void> deleteEquipe(@PathVariable Long id) {
        log.debug("REST request to delete Equipe : {}", id);
        equipeRepository.deleteById(id);
        equipeSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/equipes?query=:query} : search for the equipe corresponding
     * to the query.
     *
     * @param query the query of the equipe search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/equipes")
    public ResponseEntity<List<Equipe>> searchEquipes(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Equipes for query {}", query);
        Page<Equipe> page = equipeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
}
