package com.bmu.pronostics.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.Set;

import com.bmu.pronostics.domain.enumeration.StatutMatch;

import com.bmu.pronostics.domain.enumeration.PhaseCompetition;

/**
 * A Match.
 */
@Entity
@Table(name = "match")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "match")
public class Match implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "score_equipe_domicile")
    private Integer scoreEquipeDomicile;

    @Column(name = "score_equipe_visiteur")
    private Integer scoreEquipeVisiteur;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private Instant date;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutMatch statut;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "phase_competition", nullable = false)
    private PhaseCompetition phaseCompetition;

    @Column(name = "groupe")
    private String groupe;

    @OneToOne
    @JoinColumn(unique = true)
    private Stade stade;

    @OneToOne
    @JoinColumn(unique = true)
    private Equipe equipeDomicile;

    @OneToOne
    @JoinColumn(unique = true)
    private Equipe equipeVisiteur;

    @ManyToOne
    private Competition competition;

   /// jhipster-needle-entity-add-field - JHipster will add fields here, do not
    // remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Match match = (Match) o;
        if (match.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), match.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Match{" + "id=" + getId() + ", scoreEquipeDomicile=" + getScoreEquipeDomicile()
                + ", scoreEquipeVisiteur=" + getScoreEquipeVisiteur() + ", date='" + getDate() + "'" + ", statut='"
                + getStatut() + "'" + ", phaseCompetition='" + getPhaseCompetition() + "'" + ", groupe='" + getGroupe()
                + "'" + "}";
    }
}
