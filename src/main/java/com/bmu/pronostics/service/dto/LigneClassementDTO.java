package com.bmu.pronostics.service.dto;

public class LigneClassementDTO implements Comparable<LigneClassementDTO>{
	private Long idUtilisateur;
    private String username;
	private String nomUtilisateur;
	private String prenomUtilisateur;
	private Integer nbPointsTotal;
	private Integer nbPronosJustes;
	private Integer nbPronosPartiels;
	private Integer nbPronosFaux;
	private Integer nbPronosJoues;
	private Long position;

	public LigneClassementDTO(Long idUtilisateur, String username, String nomUtilisateur, String prenomUtilisateur, Integer nbPointsTotal,Integer nbPronosJustes, Integer nbPronosPartiels,Integer nbPronosFaux, Integer nbPronosJoues) {
		super();
		this.idUtilisateur = idUtilisateur;
        this.username = username;
		this.nomUtilisateur = nomUtilisateur;
		this.prenomUtilisateur = prenomUtilisateur;
		this.nbPointsTotal = nbPointsTotal;
		this.nbPronosJustes=nbPronosJustes;
		this.nbPronosPartiels=nbPronosPartiels;
		this.nbPronosFaux=nbPronosFaux;
		this.nbPronosJoues=nbPronosJoues;
	}
	public String getNomUtilisateur() {
		return nomUtilisateur;
	}
	public void setNomUtilisateur(String nomUtilisateur) {
		this.nomUtilisateur = nomUtilisateur;
	}
	public String getPrenomUtilisateur() {
		return prenomUtilisateur;
	}
	public void setPrenomUtilisateur(String prenomUtilisateur) {
		this.prenomUtilisateur = prenomUtilisateur;
	}
	public Integer getNbPointsTotal() {
		return nbPointsTotal;
	}
	public void setNbPointsTotal(Integer nbPointsTotal) {
		this.nbPointsTotal = nbPointsTotal;
	}

	public Integer getNbPronosJustes() {
		return nbPronosJustes;
	}
	public void setNbPronosJustes(Integer nbPronosJustes) {
		this.nbPronosJustes = nbPronosJustes;
	}
	public Integer getNbPronosPartiels() {
		return nbPronosPartiels;
	}
	public void setNbPronosPartiels(Integer nbPronosPartiels) {
		this.nbPronosPartiels = nbPronosPartiels;
	}
	public Integer getNbPronosFaux() {
		return nbPronosFaux;
	}
	public void setNbPronosFaux(Integer nbPronosFaux) {
		this.nbPronosFaux = nbPronosFaux;
	}
	public Integer getNbPronosJoues() {
		return nbPronosJoues;
	}
	public void setNbPronosJoues(Integer nbPronosJoues) {
		this.nbPronosJoues = nbPronosJoues;
	}
	/**
	 * @return the idUtilisateur
	 */
	public Long getIdUtilisateur() {
		return idUtilisateur;
	}
	/**
	 * @param idUtilisateur the idUtilisateur to set
	 */
	public void setIdUtilisateur(Long idUtilisateur) {
		this.idUtilisateur = idUtilisateur;
	}

    /**
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}
	/**
	 * @param username the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}
	/**
	 * @return the position
	 */
	public Long getPosition() {
		return position;
	}
	/**
	 * @param position the position to set
	 */
	public void setPosition(Long position) {
		this.position = position;
	}
	@Override
	public int compareTo(LigneClassementDTO o) {
		int resultCompare = this.getNbPointsTotal().compareTo(o.getNbPointsTotal());
		if(resultCompare!=0) {
			return resultCompare;
		}

		resultCompare = this.getNbPronosJustes().compareTo(o.getNbPronosJustes());
		if(resultCompare!=0) {
			return resultCompare;
		}

		resultCompare = this.getNbPronosPartiels().compareTo(o.getNbPronosPartiels());
		if(resultCompare!=0) {
			return resultCompare;
		}

		resultCompare = this.getNbPronosJoues().compareTo(o.getNbPronosJoues());
		if(resultCompare!=0) {
			return resultCompare;
		}

		resultCompare = this.getNomUtilisateur().compareTo(o.getNomUtilisateur());
		if(resultCompare!=0) {
			return -resultCompare;
		}

		resultCompare = this.getPrenomUtilisateur().compareTo(o.getPrenomUtilisateur());
		if(resultCompare!=0) {
			return -resultCompare;
		}

		return 0;
	}
}
