package com.bmu.pronostics.web.rest.errors;

public class NoUserLoggedException extends BadRequestAlertException {

    public NoUserLoggedException() {
        super(ErrorConstants.LOGIN_ALREADY_USED_TYPE, "Login already in use", "userManagement", "userexists");
    }
}
