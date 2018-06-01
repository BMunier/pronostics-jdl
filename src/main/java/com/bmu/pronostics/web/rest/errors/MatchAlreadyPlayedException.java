package com.bmu.pronostics.web.rest.errors;

public class MatchAlreadyPlayedException extends BadRequestAlertException {

    private static final long serialVersionUID = 1L;

	public MatchAlreadyPlayedException() {
        super(ErrorConstants.MATCH_ALLREADY_PLAYED, "Match already played", "pronosticManagement", "pronostic");
    }
}
