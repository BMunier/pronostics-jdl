package com.bmu.pronostics.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A Competition.
 */
@Entity
@Table(name = "competition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "competition")
public class Competition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @NotNull
    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "competition_equipe",
               joinColumns = @JoinColumn(name = "competition_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "equipe_id", referencedColumnName = "id"))
    private Set<Equipe> equipes = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "competition_pays",
               joinColumns = @JoinColumn(name = "competition_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "pays_id", referencedColumnName = "id"))
    private Set<Pays> pays = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "competition_stade",
               joinColumns = @JoinColumn(name = "competition_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "stade_id", referencedColumnName = "id"))
    private Set<Stade> stades = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public Competition nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public Competition description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public Competition dateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public Competition dateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Set<Equipe> getEquipes() {
        return equipes;
    }

    public Competition equipes(Set<Equipe> equipes) {
        this.equipes = equipes;
        return this;
    }

    public Competition addEquipe(Equipe equipe) {
        this.equipes.add(equipe);
        equipe.getCompetitions().add(this);
        return this;
    }

    public Competition removeEquipe(Equipe equipe) {
        this.equipes.remove(equipe);
        equipe.getCompetitions().remove(this);
        return this;
    }

    public void setEquipes(Set<Equipe> equipes) {
        this.equipes = equipes;
    }

    public Set<Pays> getPays() {
        return pays;
    }

    public Competition pays(Set<Pays> pays) {
        this.pays = pays;
        return this;
    }

    public Competition addPays(Pays pays) {
        this.pays.add(pays);
        pays.getCompetitions().add(this);
        return this;
    }

    public Competition removePays(Pays pays) {
        this.pays.remove(pays);
        pays.getCompetitions().remove(this);
        return this;
    }

    public void setPays(Set<Pays> pays) {
        this.pays = pays;
    }

    public Set<Stade> getStades() {
        return stades;
    }

    public Competition stades(Set<Stade> stades) {
        this.stades = stades;
        return this;
    }

    public Competition addStade(Stade stade) {
        this.stades.add(stade);
        stade.getCompetitions().add(this);
        return this;
    }

    public Competition removeStade(Stade stade) {
        this.stades.remove(stade);
        stade.getCompetitions().remove(this);
        return this;
    }

    public void setStades(Set<Stade> stades) {
        this.stades = stades;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Competition)) {
            return false;
        }
        return id != null && id.equals(((Competition) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Competition{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
