package com.bmu.pronostics.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Pronostic.
 */
@Entity
@Table(name = "pronostic")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "pronostic")
public class Pronostic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "score_equipe_domicile", nullable = false)
    private Integer scoreEquipeDomicile;

    @NotNull
    @Column(name = "score_equipe_visiteur", nullable = false)
    private Integer scoreEquipeVisiteur;

    @Column(name = "points")
    private Integer points;

    @ManyToOne
    private Match match;

    @ManyToOne
    private User utilisateur;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getScoreEquipeDomicile() {
        return scoreEquipeDomicile;
    }

    public Pronostic scoreEquipeDomicile(Integer scoreEquipeDomicile) {
        this.scoreEquipeDomicile = scoreEquipeDomicile;
        return this;
    }

    public void setScoreEquipeDomicile(Integer scoreEquipeDomicile) {
        this.scoreEquipeDomicile = scoreEquipeDomicile;
    }

    public Integer getScoreEquipeVisiteur() {
        return scoreEquipeVisiteur;
    }

    public Pronostic scoreEquipeVisiteur(Integer scoreEquipeVisiteur) {
        this.scoreEquipeVisiteur = scoreEquipeVisiteur;
        return this;
    }

    public void setScoreEquipeVisiteur(Integer scoreEquipeVisiteur) {
        this.scoreEquipeVisiteur = scoreEquipeVisiteur;
    }

    public Integer getPoints() {
        return points;
    }

    public Pronostic points(Integer points) {
        this.points = points;
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Match getMatch() {
        return match;
    }

    public Pronostic match(Match match) {
        this.match = match;
        return this;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public User getUtilisateur() {
        return utilisateur;
    }

    public Pronostic utilisateur(User user) {
        this.utilisateur = user;
        return this;
    }

    public void setUtilisateur(User user) {
        this.utilisateur = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Pronostic pronostic = (Pronostic) o;
        if (pronostic.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), pronostic.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Pronostic{" +
            "id=" + getId() +
            ", scoreEquipeDomicile=" + getScoreEquipeDomicile() +
            ", scoreEquipeVisiteur=" + getScoreEquipeVisiteur() +
            ", points=" + getPoints() +
            "}";
    }
}
