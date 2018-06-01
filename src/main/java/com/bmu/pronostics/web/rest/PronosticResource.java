package com.bmu.pronostics.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Collections2;
import com.bmu.pronostics.domain.Match;
import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.domain.User;
import com.bmu.pronostics.domain.enumeration.StatutMatch;
import com.bmu.pronostics.repository.MatchRepository;
import com.bmu.pronostics.repository.PronosticRepository;
import com.bmu.pronostics.repository.UserRepository;
import com.bmu.pronostics.repository.search.PronosticSearchRepository;
import com.bmu.pronostics.security.UserNotActivatedException;
import com.bmu.pronostics.service.UserService;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;
import com.bmu.pronostics.web.rest.errors.MatchAlreadyPlayedException;
import com.bmu.pronostics.web.rest.errors.NoUserLoggedException;
import com.bmu.pronostics.web.rest.util.HeaderUtil;
import com.bmu.pronostics.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Pronostic.
 */
@RestController
@RequestMapping("/api")
public class PronosticResource {

    private final Logger log = LoggerFactory.getLogger(PronosticResource.class);

    private static final String ENTITY_NAME = "pronostic";

    private final PronosticRepository pronosticRepository;

    private final PronosticSearchRepository pronosticSearchRepository;

    private final UserService userService;

    private final MatchRepository matchRepository;

    public PronosticResource(PronosticRepository pronosticRepository,
            PronosticSearchRepository pronosticSearchRepository, UserService userService,
            MatchRepository matchRepository) {
        this.pronosticRepository = pronosticRepository;
        this.pronosticSearchRepository = pronosticSearchRepository;
        this.userService = userService;
        this.matchRepository = matchRepository;
    }

    /**
     * POST /pronostics : Create a new pronostic.
     *
     * @param pronostic the pronostic to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         pronostic, or with status 400 (Bad Request) if the pronostic has
     *         already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/pronostics")
    @Timed
    public ResponseEntity<Pronostic> createPronostic(@Valid @RequestBody Pronostic pronostic)
            throws URISyntaxException {
        log.debug("REST request to save Pronostic : {}", pronostic);
        if (pronostic.getId() != null) {
            throw new BadRequestAlertException("A new pronostic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pronostic result = pronosticRepository.save(pronostic);
        pronosticSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/pronostics/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * PUT /pronostics : Updates an existing pronostic.
     *
     * @param pronostic the pronostic to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         pronostic, or with status 400 (Bad Request) if the pronostic is not
     *         valid, or with status 500 (Internal Server Error) if the pronostic
     *         couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/pronostics")
    @Timed
    public ResponseEntity<Pronostic> updatePronostic(@Valid @RequestBody Pronostic pronostic)
            throws URISyntaxException {
        log.debug("REST request to update Pronostic : {}", pronostic);
        if (pronostic.getId() == null) {
            return createPronostic(pronostic);
        }
        Pronostic result = pronosticRepository.save(pronostic);
        pronosticSearchRepository.save(result);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, pronostic.getId().toString())).body(result);
    }

    /**
     * PUT /pronostics : Updates an existing pronostic.
     *
     * @param pronostic the pronostic to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         pronostic, or with status 400 (Bad Request) if the pronostic is not
     *         valid, or with status 500 (Internal Server Error) if the pronostic
     *         couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/pronosticsSaisi")
    @Timed
    public ResponseEntity<Pronostic> updatePronosticSaisie(@Valid @RequestBody Pronostic pronostic)
            throws URISyntaxException {
        log.debug("REST request to update PronosticSaisie : {}", pronostic);
        if(pronostic.matchDejaJoue()){
            throw new MatchAlreadyPlayedException();
           
        }
        if (pronostic.getId() == null) {
            return createPronostic(pronostic);
        }
        Pronostic result = pronosticRepository.save(pronostic);
        pronosticSearchRepository.save(result);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, pronostic.getId().toString())).body(result);
    }

    /**
     * GET /pronostics : get all the pronostics.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of pronostics in
     *         body
     */
    @GetMapping("/pronostics")
    @Timed
    public ResponseEntity<List<Pronostic>> getAllPronostics(Pageable pageable) {
        log.debug("REST request to get a page of Pronostics");
        Page<Pronostic> page = pronosticRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/pronostics");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET /pronostics : get all the pronostics.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of pronostics in
     *         body
     */
    @GetMapping("/pronosticsSaisi")
    @Timed
    public ResponseEntity<List<Pronostic>> getAllPronosticsSaisie(@PageableDefault(size=100)Pageable pageable, Long idUtilisateur) {
        log.debug("REST request to get a page of PronosticsSaisi");
        Optional<User> user = userService.getUserWithAuthorities();
        if (!user.isPresent()) {
            throw new NoUserLoggedException();
        }
        // On recherche les match pour pouvoir ajouter les pronos non-encore saisis
        List<Match> matchesExistents = matchRepository.findAll();
        List<Match> matchesDejaPronostiques = new ArrayList<Match>();
        List<Pronostic> pronostics = pronosticRepository.findByUtilisateurIsCurrentUser();
        // On regarde si le prono existe existe déjà pour le match
        pronostics.forEach(pronostic -> {
            matchesDejaPronostiques.add(pronostic.getMatch());
        });

        matchesExistents.removeAll(matchesDejaPronostiques);
        matchesExistents.forEach(match ->{
            pronostics.add(creerNouveauPronostic(match,user.get()));
        }
        );
        List<Pronostic> retourProno = sortPronostics(pronostics);
        int start = pageable.getOffset();
        int end = (start + pageable.getPageSize()) > retourProno.size() ? retourProno.size()
                : (start + pageable.getPageSize());

        Page<Pronostic> page = new PageImpl<Pronostic>(retourProno.subList(start, end), pageable, retourProno.size());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/pronosticsSaisie");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    private Pronostic creerNouveauPronostic(Match match, User user){
        return new Pronostic().match(match).utilisateur(user);
        
    }

      /**
     * Méthode qui trie les pronos selon l'ordre désiré
     *
     * @param pronostics Liste de pronosti
     * @return les pronostics triés par Statut puis par date
     */
    private List<Pronostic> sortPronostics(List<Pronostic> pronostics){
        pronostics.sort(new Comparator<Pronostic>() {
          	@Override
			public int compare(Pronostic o1, Pronostic o2) {
                if(o1.getMatch().getStatut().name()==o2.getMatch().getStatut().name()){
                    return o1.getMatch().getDate().compareTo(o2.getMatch().getDate());
                }
                if(o1.getMatch().getStatut().name()==StatutMatch.TERMINE.name()){
                    return 1;
                }else if (o1.getMatch().getStatut().name()==StatutMatch.EN_COURS.name()){
                        if(o2.getMatch().getStatut().name()==StatutMatch.TERMINE.name()){
                            return -1;
                        }
                }
                return -1;
			}
        });
        return pronostics;
    }

    /**
     * GET /pronostics/:id : get the "id" pronostic.
     *
     * @param id the id of the pronostic to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the pronostic,
     *         or with status 404 (Not Found)
     */
    @GetMapping("/pronostics/{id}")
    @Timed
    public ResponseEntity<Pronostic> getPronostic(@PathVariable Long id) {
        log.debug("REST request to get Pronostic : {}", id);
        Pronostic pronostic = pronosticRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(pronostic));
    }

    /**
     * DELETE /pronostics/:id : delete the "id" pronostic.
     *
     * @param id the id of the pronostic to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/pronostics/{id}")
    @Timed
    public ResponseEntity<Void> deletePronostic(@PathVariable Long id) {
        log.debug("REST request to delete Pronostic : {}", id);
        pronosticRepository.delete(id);
        pronosticSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH /_search/pronostics?query=:query : search for the pronostic
     * corresponding to the query.
     *
     * @param query    the query of the pronostic search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/pronostics")
    @Timed
    public ResponseEntity<List<Pronostic>> searchPronostics(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Pronostics for query {}", query);
        Page<Pronostic> page = pronosticSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page,
                "/api/_search/pronostics");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
