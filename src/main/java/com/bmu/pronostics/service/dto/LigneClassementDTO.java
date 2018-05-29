package com.bmu.pronostics.service.dto;

public class LigneClassementDTO implements Comparable<LigneClassementDTO>{
	private String nomUtilisateur;
	private String prenomUtilisateur;
	private Integer nbPointsTotal;
	private Integer nbPronosJustes;
	private Integer nbPronosPartiels;
	private Integer nbPronosFaux;
	private Integer nbPronosJoues;
	
	public LigneClassementDTO(String nomUtilisateur, String prenomUtilisateur, Integer nbPointsTotal,Integer nbPronosJustes, Integer nbPronosPartiels,Integer nbPronosFaux, Integer nbPronosJoues) {
		super();
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
		
		return 0;
	}
}
