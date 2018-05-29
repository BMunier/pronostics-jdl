package com.bmu.pronostics.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import com.bmu.pronostics.domain.Competition;
import com.bmu.pronostics.domain.Pronostic;
import com.bmu.pronostics.domain.User;
import com.bmu.pronostics.repository.CompetitionRepository;
import com.bmu.pronostics.repository.PronosticRepository;
import com.bmu.pronostics.repository.search.CompetitionSearchRepository;
import com.bmu.pronostics.service.dto.LigneClassementDTO;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;
import com.bmu.pronostics.web.rest.util.HeaderUtil;
import com.codahale.metrics.annotation.Timed;

import io.github.jhipster.web.util.ResponseUtil;

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
    
    private final PronosticRepository pronosticRepository;

    public CompetitionResource(CompetitionRepository competitionRepository, CompetitionSearchRepository competitionSearchRepository, PronosticRepository pronosticRepository) {
        this.competitionRepository = competitionRepository;
        this.competitionSearchRepository = competitionSearchRepository;
        this.pronosticRepository = pronosticRepository;
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
        return competitionRepository.findAllWithEagerRelationships();
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
        Competition competition = competitionRepository.findOneWithEagerRelationships(id);
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
    
    @GetMapping("/competitions/classement")
    @Timed
    public List<LigneClassementDTO> calculerClassement(){
    	List<Pronostic> pronostics = pronosticRepository.findAll();
    	
    	Map<Long, LigneClassementDTO> lignesClassementByUserIdMap = new HashMap<Long, LigneClassementDTO>();
    	for(Pronostic pronostic : pronostics) {
    		if(pronostic.getPoints()==null) {
    			continue;
    		}
    		User utilisateur =  pronostic.getUtilisateur();
    		
    		Integer incPronosJustes=0;
    		Integer incPronosPartiels=0;
    		Integer incPronosFaux=0;
    		Integer incPronosJoues=1;
    		
    		if(pronostic.getPoints()==3) {
    			incPronosJustes=1;
    		}else if(pronostic.getPoints()==1) {
    			incPronosPartiels=1;
    		}else {
    			incPronosFaux=1;
    		}
    		
    		if(lignesClassementByUserIdMap.containsKey(utilisateur.getId())) {
    			LigneClassementDTO ligneClassementActuelle = lignesClassementByUserIdMap.get(utilisateur.getId());
    			ligneClassementActuelle.setNbPointsTotal(ligneClassementActuelle.getNbPointsTotal()+pronostic.getPoints());
    			ligneClassementActuelle.setNbPronosJustes(ligneClassementActuelle.getNbPronosJustes()+incPronosJustes);
    			ligneClassementActuelle.setNbPronosPartiels(ligneClassementActuelle.getNbPronosPartiels()+incPronosPartiels);
    			ligneClassementActuelle.setNbPronosFaux(ligneClassementActuelle.getNbPronosFaux()+incPronosFaux);
    			ligneClassementActuelle.setNbPronosJoues(ligneClassementActuelle.getNbPronosJoues()+incPronosJoues);
    		}else {
    			LigneClassementDTO ligneClassement = new LigneClassementDTO(utilisateur.getLastName(), utilisateur.getFirstName(), pronostic.getPoints(),incPronosJustes,incPronosPartiels,incPronosFaux,incPronosJoues);
    			lignesClassementByUserIdMap.put(utilisateur.getId(), ligneClassement);
    		}
        }
        
        List<LigneClassementDTO>  lignesClassement = new ArrayList<LigneClassementDTO>();
        for(Map.Entry<Long,LigneClassementDTO> entry : lignesClassementByUserIdMap.entrySet()){
            lignesClassement.add(entry.getValue());
        }
        
        Collections.sort(lignesClassement);
        Collections.reverse(lignesClassement);
    	
    	return lignesClassement;
    }

}
