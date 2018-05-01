package com.bmu.pronostics.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Pays.
 */
@Entity
@Table(name = "pays")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "pays")
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

    @NotNull
    @Lob
    @Column(name = "drapeau", nullable = false)
    private byte[] drapeau;

    @Column(name = "drapeau_content_type", nullable = false)
    private String drapeauContentType;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Pays pays = (Pays) o;
        if (pays.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), pays.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

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
