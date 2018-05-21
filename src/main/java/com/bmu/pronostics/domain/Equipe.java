package com.bmu.pronostics.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Equipe.
 */
@Entity
@Table(name = "equipe")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "equipe")
public class Equipe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "code_equipe")
    private String codeEquipe;

    @Column(name = "nom_equipe")
    private String nomEquipe;

    @Column(name = "rang_fifa")
    private Integer rangFifa;

    @NotNull
    @Lob
    @Column(name = "ecusson", nullable = false)
    private byte[] ecusson;

    @Column(name = "ecusson_content_type", nullable = false)
    private String ecussonContentType;

    @ManyToOne
    private Pays pays;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodeEquipe() {
        return codeEquipe;
    }

    public Equipe codeEquipe(String codeEquipe) {
        this.codeEquipe = codeEquipe;
        return this;
    }

    public void setCodeEquipe(String codeEquipe) {
        this.codeEquipe = codeEquipe;
    }

    public String getNomEquipe() {
        return nomEquipe;
    }

    public Equipe nomEquipe(String nomEquipe) {
        this.nomEquipe = nomEquipe;
        return this;
    }

    public void setNomEquipe(String nomEquipe) {
        this.nomEquipe = nomEquipe;
    }

    public Integer getRangFifa() {
        return rangFifa;
    }

    public Equipe rangFifa(Integer rangFifa) {
        this.rangFifa = rangFifa;
        return this;
    }

    public void setRangFifa(Integer rangFifa) {
        this.rangFifa = rangFifa;
    }

    public byte[] getEcusson() {
        return ecusson;
    }

    public Equipe ecusson(byte[] ecusson) {
        this.ecusson = ecusson;
        return this;
    }

    public void setEcusson(byte[] ecusson) {
        this.ecusson = ecusson;
    }

    public String getEcussonContentType() {
        return ecussonContentType;
    }

    public Equipe ecussonContentType(String ecussonContentType) {
        this.ecussonContentType = ecussonContentType;
        return this;
    }

    public void setEcussonContentType(String ecussonContentType) {
        this.ecussonContentType = ecussonContentType;
    }

    public Pays getPays() {
        return pays;
    }

    public Equipe pays(Pays pays) {
        this.pays = pays;
        return this;
    }

    public void setPays(Pays pays) {
        this.pays = pays;
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
        Equipe equipe = (Equipe) o;
        if (equipe.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), equipe.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Equipe{" +
            "id=" + getId() +
            ", codeEquipe='" + getCodeEquipe() + "'" +
            ", nomEquipe='" + getNomEquipe() + "'" +
            ", rangFifa=" + getRangFifa() +
            ", ecusson='" + getEcusson() + "'" +
            ", ecussonContentType='" + getEcussonContentType() + "'" +
            "}";
    }
}
