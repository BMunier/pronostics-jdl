package com.bmu.pronostics.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.bmu.pronostics.domain.Competition;
import com.bmu.pronostics.repository.CompetitionRepository;
import com.bmu.pronostics.repository.search.CompetitionSearchRepository;
import com.bmu.pronostics.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bmu.pronostics.domain.Competition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompetitionResource {

    private static final int POINT_PRONO_PARTIEL = 1;

	private static final int POINT_PRONO_JUSTE = 3;

	private final Logger log = LoggerFactory.getLogger(CompetitionResource.class);

    private static final String ENTITY_NAME = "competition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompetitionRepository competitionRepository;

    private final CompetitionSearchRepository competitionSearchRepository;

    private final PronosticRepository pronosticRepository;

    private long position;

    public CompetitionResource(CompetitionRepository competitionRepository, CompetitionSearchRepository competitionSearchRepository, PronosticRepository pronosticRepository) {
        this.competitionRepository = competitionRepository;
        this.competitionSearchRepository = competitionSearchRepository;
        this.pronosticRepository = pronosticRepository;
    }

    /**
     * {@code POST  /competitions} : Create a new competition.
     *
     * @param competition the competition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new competition, or with status {@code 400 (Bad Request)} if the competition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/competitions")
    public ResponseEntity<Competition> createCompetition(@Valid @RequestBody Competition competition) throws URISyntaxException {
        log.debug("REST request to save Competition : {}", competition);
        if (competition.getId() != null) {
            throw new BadRequestAlertException("A new competition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Competition result = competitionRepository.save(competition);
        competitionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/competitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /competitions} : Updates an existing competition.
     *
     * @param competition the competition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated competition,
     * or with status {@code 400 (Bad Request)} if the competition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the competition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/competitions")
    public ResponseEntity<Competition> updateCompetition(@Valid @RequestBody Competition competition) throws URISyntaxException {
        log.debug("REST request to update Competition : {}", competition);
        if (competition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Competition result = competitionRepository.save(competition);
        competitionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, competition.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /competitions} : get all the competitions.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of competitions in body.
     */
    @GetMapping("/competitions")
    public List<Competition> getAllCompetitions(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Competitions");
        return competitionRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /competitions/:id} : get the "id" competition.
     *
     * @param id the id of the competition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the competition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/competitions/{id}")
    public ResponseEntity<Competition> getCompetition(@PathVariable Long id) {
        log.debug("REST request to get Competition : {}", id);
        Optional<Competition> competition = competitionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(competition);
    }

    /**
     * {@code DELETE  /competitions/:id} : delete the "id" competition.
     *
     * @param id the id of the competition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/competitions/{id}")
    public ResponseEntity<Void> deleteCompetition(@PathVariable Long id) {
        log.debug("REST request to delete Competition : {}", id);
        competitionRepository.deleteById(id);
        competitionSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/competitions?query=:query} : search for the competition corresponding
     * to the query.
     *
     * @param query the query of the competition search.
     * @return the result of the search.
     */
    @GetMapping("/_search/competitions")
    public List<Competition> searchCompetitions(@RequestParam String query) {
        log.debug("REST request to search Competitions for query {}", query);
        return StreamSupport
            .stream(competitionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
        .collect(Collectors.toList());
    }

    @GetMapping("/competitions/classement")
    @Timed
    public List<LigneClassementDTO> calculerClassement(){
    	//recherche des pronos
    	List<Pronostic> pronostics = pronosticRepository.findForMatchsTerminesOnly();

    	//itération sur tous les pronos et calcul des points
    	Map<Long, LigneClassementDTO> lignesClassementByUserIdMap = new HashMap<Long, LigneClassementDTO>();
    	for(Pronostic pronostic : pronostics) {
    		if(pronostic.getPoints()==null) {
    			log.warn("les points du prono sont null alors que le match est terminé "+pronostic.getId());
    			continue;
    		}

    		User utilisateur =  pronostic.getUtilisateur();
    		Integer incPronosJustes=0;
    		Integer incPronosPartiels=0;
    		Integer incPronosFaux=0;
    		Integer incPronosJoues=1;

    		if(pronostic.getPoints()==POINT_PRONO_JUSTE) {
    			incPronosJustes=1;
    		}else if(pronostic.getPoints()==POINT_PRONO_PARTIEL) {
    			incPronosPartiels=1;
    		}else {
    			incPronosFaux=1;
    		}

    		//création ou mise à jour de la ligne de classement
    		if(lignesClassementByUserIdMap.containsKey(utilisateur.getId())) {
    			LigneClassementDTO ligneClassementActuelle = lignesClassementByUserIdMap.get(utilisateur.getId());
    			ligneClassementActuelle.setNbPointsTotal(ligneClassementActuelle.getNbPointsTotal()+pronostic.getPoints());
    			ligneClassementActuelle.setNbPronosJustes(ligneClassementActuelle.getNbPronosJustes()+incPronosJustes);
    			ligneClassementActuelle.setNbPronosPartiels(ligneClassementActuelle.getNbPronosPartiels()+incPronosPartiels);
    			ligneClassementActuelle.setNbPronosFaux(ligneClassementActuelle.getNbPronosFaux()+incPronosFaux);
    			ligneClassementActuelle.setNbPronosJoues(ligneClassementActuelle.getNbPronosJoues()+incPronosJoues);
    		}else {
    			LigneClassementDTO ligneClassement = new LigneClassementDTO(utilisateur.getId(), utilisateur.getLogin() , utilisateur.getLastName(), utilisateur.getFirstName(), pronostic.getPoints(),incPronosJustes,incPronosPartiels,incPronosFaux,incPronosJoues);
    			lignesClassementByUserIdMap.put(utilisateur.getId(), ligneClassement);
    		}
        }

    	//récupération des lignes de classement et tri
        List<LigneClassementDTO>  lignesClassement = new ArrayList<LigneClassementDTO>();
        for(Map.Entry<Long,LigneClassementDTO> entry : lignesClassementByUserIdMap.entrySet()){
            lignesClassement.add(entry.getValue());
        }
        Collections.sort(lignesClassement);
        Collections.reverse(lignesClassement);

        //On donne une position au classement
        position= 0;
        lignesClassement.forEach(ligneClassement->{
            position++;
            ligneClassement.setPosition(position);

        });
    	return lignesClassement;
    }

    @GetMapping("/competitions/classement/{idCompetition}")
    @Timed
    public List<LigneClassementDTO> calculerClassementForIdCompetition(@PathVariable Long idCompetition){
    	//recherche des pronostics pour les matches terminés de la compétition sélectionnée
        List<Pronostic> pronostics = pronosticRepository.findForMatchsTerminesAndCompetitionIdOnly(idCompetition);

    	//itération sur tous les pronos et calcul des points
    	Map<Long, LigneClassementDTO> lignesClassementByUserIdMap = new HashMap<Long, LigneClassementDTO>();
    	for(Pronostic pronostic : pronostics) {
    		if(pronostic.getPoints()==null) {
    			log.warn("les points du prono sont null alors que le match est terminé "+pronostic.getId());
    			continue;
    		}

    		User utilisateur =  pronostic.getUtilisateur();
    		Integer incPronosJustes=0;
    		Integer incPronosPartiels=0;
    		Integer incPronosFaux=0;
    		Integer incPronosJoues=1;

    		if(pronostic.getPoints()==POINT_PRONO_JUSTE) {
    			incPronosJustes=1;
    		}else if(pronostic.getPoints()==POINT_PRONO_PARTIEL) {
    			incPronosPartiels=1;
    		}else {
    			incPronosFaux=1;
    		}

    		//création ou mise à jour de la ligne de classement
    		if(lignesClassementByUserIdMap.containsKey(utilisateur.getId())) {
    			LigneClassementDTO ligneClassementActuelle = lignesClassementByUserIdMap.get(utilisateur.getId());
    			ligneClassementActuelle.setNbPointsTotal(ligneClassementActuelle.getNbPointsTotal()+pronostic.getPoints());
    			ligneClassementActuelle.setNbPronosJustes(ligneClassementActuelle.getNbPronosJustes()+incPronosJustes);
    			ligneClassementActuelle.setNbPronosPartiels(ligneClassementActuelle.getNbPronosPartiels()+incPronosPartiels);
    			ligneClassementActuelle.setNbPronosFaux(ligneClassementActuelle.getNbPronosFaux()+incPronosFaux);
    			ligneClassementActuelle.setNbPronosJoues(ligneClassementActuelle.getNbPronosJoues()+incPronosJoues);
    		}else {
    			LigneClassementDTO ligneClassement = new LigneClassementDTO(utilisateur.getId(),utilisateur.getLogin(), utilisateur.getLastName(), utilisateur.getFirstName(), pronostic.getPoints(),incPronosJustes,incPronosPartiels,incPronosFaux,incPronosJoues);
    			lignesClassementByUserIdMap.put(utilisateur.getId(), ligneClassement);
    		}
        }

    	//récupération des lignes de classement et tri
        List<LigneClassementDTO>  lignesClassement = new ArrayList<LigneClassementDTO>();
        for(Map.Entry<Long,LigneClassementDTO> entry : lignesClassementByUserIdMap.entrySet()){
            lignesClassement.add(entry.getValue());
        }
        Collections.sort(lignesClassement);
        Collections.reverse(lignesClassement);

        //On donne une position au classement
        position= 0;
        lignesClassement.forEach(ligneClassement->{
            position++;
            ligneClassement.setPosition(position);

        });
    	return lignesClassement;
    }
}
