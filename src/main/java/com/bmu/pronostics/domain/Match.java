package com.bmu.pronostics.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

import com.bmu.pronostics.domain.enumeration.StatutMatch;

import com.bmu.pronostics.domain.enumeration.PhaseCompetition;

/**
 * A Match.
 */
@Entity
@Table(name = "match")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "match")
public class Match implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutMatch statut;

    @Column(name = "code")
    private String code;

    @Column(name = "score_equipe_domicile")
    private Integer scoreEquipeDomicile;

    @Column(name = "score_equipe_visiteur")
    private Integer scoreEquipeVisiteur;

    @Enumerated(EnumType.STRING)
    @Column(name = "phase_competition")
    private PhaseCompetition phaseCompetition;

    @Column(name = "groupe")
    private String groupe;

    @ManyToOne
    @JsonIgnoreProperties(value = "matches", allowSetters = true)
    private Competition competition;

    @ManyToOne
    @JsonIgnoreProperties(value = "matches", allowSetters = true)
    private Stade stade;

    @ManyToOne
    @JsonIgnoreProperties(value = "matches", allowSetters = true)
    private Equipe equipeDomicile;

    @ManyToOne
    @JsonIgnoreProperties(value = "matches", allowSetters = true)
    private Equipe equipeVisiteur;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return date;
    }

    public Match date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public StatutMatch getStatut() {
        return statut;
    }

    public Match statut(StatutMatch statut) {
        this.statut = statut;
        return this;
    }

    public void setStatut(StatutMatch statut) {
        this.statut = statut;
    }

    public String getCode() {
        return code;
    }

    public Match code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getScoreEquipeDomicile() {
        return scoreEquipeDomicile;
    }

    public Match scoreEquipeDomicile(Integer scoreEquipeDomicile) {
        this.scoreEquipeDomicile = scoreEquipeDomicile;
        return this;
    }

    public void setScoreEquipeDomicile(Integer scoreEquipeDomicile) {
        this.scoreEquipeDomicile = scoreEquipeDomicile;
    }

    public Integer getScoreEquipeVisiteur() {
        return scoreEquipeVisiteur;
    }

    public Match scoreEquipeVisiteur(Integer scoreEquipeVisiteur) {
        this.scoreEquipeVisiteur = scoreEquipeVisiteur;
        return this;
    }

    public void setScoreEquipeVisiteur(Integer scoreEquipeVisiteur) {
        this.scoreEquipeVisiteur = scoreEquipeVisiteur;
    }

    public PhaseCompetition getPhaseCompetition() {
        return phaseCompetition;
    }

    public Match phaseCompetition(PhaseCompetition phaseCompetition) {
        this.phaseCompetition = phaseCompetition;
        return this;
    }

    public void setPhaseCompetition(PhaseCompetition phaseCompetition) {
        this.phaseCompetition = phaseCompetition;
    }

    public String getGroupe() {
        return groupe;
    }

    public Match groupe(String groupe) {
        this.groupe = groupe;
        return this;
    }

    public void setGroupe(String groupe) {
        this.groupe = groupe;
    }

    public Competition getCompetition() {
        return competition;
    }

    public Match competition(Competition competition) {
        this.competition = competition;
        return this;
    }

    public void setCompetition(Competition competition) {
        this.competition = competition;
    }

    public Stade getStade() {
        return stade;
    }

    public Match stade(Stade stade) {
        this.stade = stade;
        return this;
    }

    public void setStade(Stade stade) {
        this.stade = stade;
    }

    public Equipe getEquipeDomicile() {
        return equipeDomicile;
    }

    public Match equipeDomicile(Equipe equipe) {
        this.equipeDomicile = equipe;
        return this;
    }

    public void setEquipeDomicile(Equipe equipe) {
        this.equipeDomicile = equipe;
    }

    public Equipe getEquipeVisiteur() {
        return equipeVisiteur;
    }

    public Match equipeVisiteur(Equipe equipe) {
        this.equipeVisiteur = equipe;
        return this;
    }

    public void setEquipeVisiteur(Equipe equipe) {
        this.equipeVisiteur = equipe;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Match)) {
            return false;
        }
        return id != null && id.equals(((Match) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Match{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", statut='" + getStatut() + "'" +
            ", code='" + getCode() + "'" +
            ", scoreEquipeDomicile=" + getScoreEquipeDomicile() +
            ", scoreEquipeVisiteur=" + getScoreEquipeVisiteur() +
            ", phaseCompetition='" + getPhaseCompetition() + "'" +
            ", groupe='" + getGroupe() + "'" +
            "}";
    }
}
