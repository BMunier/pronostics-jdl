package com.bmu.pronostics.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Pays.
 */
@Entity
@Table(name = "pays")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "pays")
public class Pays implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "code_iso", nullable = false)
    private String codeIso;

    
    @Lob
    @Column(name = "drapeau", nullable = false)
    private byte[] drapeau;

    @Column(name = "drapeau_content_type", nullable = false)
    private String drapeauContentType;

    @ManyToMany(mappedBy = "pays")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnore
    private Set<Competition> competitions = new HashSet<>();

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

    public Pays nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCodeIso() {
        return codeIso;
    }

    public Pays codeIso(String codeIso) {
        this.codeIso = codeIso;
        return this;
    }

    public void setCodeIso(String codeIso) {
        this.codeIso = codeIso;
    }

    public byte[] getDrapeau() {
        return drapeau;
    }

    public Pays drapeau(byte[] drapeau) {
        this.drapeau = drapeau;
        return this;
    }

    public void setDrapeau(byte[] drapeau) {
        this.drapeau = drapeau;
    }

    public String getDrapeauContentType() {
        return drapeauContentType;
    }

    public Pays drapeauContentType(String drapeauContentType) {
        this.drapeauContentType = drapeauContentType;
        return this;
    }

    public void setDrapeauContentType(String drapeauContentType) {
        this.drapeauContentType = drapeauContentType;
    }

    public Set<Competition> getCompetitions() {
        return competitions;
    }

    public Pays competitions(Set<Competition> competitions) {
        this.competitions = competitions;
        return this;
    }

    public Pays addCompetition(Competition competition) {
        this.competitions.add(competition);
        competition.getPays().add(this);
        return this;
    }

    public Pays removeCompetition(Competition competition) {
        this.competitions.remove(competition);
        competition.getPays().remove(this);
        return this;
    }

    public void setCompetitions(Set<Competition> competitions) {
        this.competitions = competitions;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pays)) {
            return false;
        }
        return id != null && id.equals(((Pays) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pays{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", codeIso='" + getCodeIso() + "'" +
            ", drapeau='" + getDrapeau() + "'" +
            ", drapeauContentType='" + getDrapeauContentType() + "'" +
            "}";
    }
}
