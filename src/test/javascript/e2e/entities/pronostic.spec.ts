import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Pronostic e2e test', () => {

    let navBarPage: NavBarPage;
    let pronosticDialogPage: PronosticDialogPage;
    let pronosticComponentsPage: PronosticComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Pronostics', () => {
        navBarPage.goToEntity('pronostic');
        pronosticComponentsPage = new PronosticComponentsPage();
        expect(pronosticComponentsPage.getTitle())
            .toMatch(/pronosticsApp.pronostic.home.title/);

    });

    it('should load create Pronostic dialog', () => {
        pronosticComponentsPage.clickOnCreateButton();
        pronosticDialogPage = new PronosticDialogPage();
        expect(pronosticDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.pronostic.home.createOrEditLabel/);
        pronosticDialogPage.close();
    });

    it('should create and save Pronostics', () => {
        pronosticComponentsPage.clickOnCreateButton();
        pronosticDialogPage.setScoreEquipeDomicileInput('5');
        expect(pronosticDialogPage.getScoreEquipeDomicileInput()).toMatch('5');
        pronosticDialogPage.setScoreEquipeVisiteurInput('5');
        expect(pronosticDialogPage.getScoreEquipeVisiteurInput()).toMatch('5');
        pronosticDialogPage.setPointsInput('5');
        expect(pronosticDialogPage.getPointsInput()).toMatch('5');
        pronosticDialogPage.matchSelectLastOption();
        pronosticDialogPage.utilisateurSelectLastOption();
        pronosticDialogPage.save();
        expect(pronosticDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PronosticComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-pronostic div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PronosticDialogPage {
    modalTitle = element(by.css('h4#myPronosticLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    scoreEquipeDomicileInput = element(by.css('input#field_scoreEquipeDomicile'));
    scoreEquipeVisiteurInput = element(by.css('input#field_scoreEquipeVisiteur'));
    pointsInput = element(by.css('input#field_points'));
    matchSelect = element(by.css('select#field_match'));
    utilisateurSelect = element(by.css('select#field_utilisateur'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setScoreEquipeDomicileInput = function(scoreEquipeDomicile) {
        this.scoreEquipeDomicileInput.sendKeys(scoreEquipeDomicile);
    };

    getScoreEquipeDomicileInput = function() {
        return this.scoreEquipeDomicileInput.getAttribute('value');
    };

    setScoreEquipeVisiteurInput = function(scoreEquipeVisiteur) {
        this.scoreEquipeVisiteurInput.sendKeys(scoreEquipeVisiteur);
    };

    getScoreEquipeVisiteurInput = function() {
        return this.scoreEquipeVisiteurInput.getAttribute('value');
    };

    setPointsInput = function(points) {
        this.pointsInput.sendKeys(points);
    };

    getPointsInput = function() {
        return this.pointsInput.getAttribute('value');
    };

    matchSelectLastOption = function() {
        this.matchSelect.all(by.tagName('option')).last().click();
    };

    matchSelectOption = function(option) {
        this.matchSelect.sendKeys(option);
    };

    getMatchSelect = function() {
        return this.matchSelect;
    };

    getMatchSelectedOption = function() {
        return this.matchSelect.element(by.css('option:checked')).getText();
    };

    utilisateurSelectLastOption = function() {
        this.utilisateurSelect.all(by.tagName('option')).last().click();
    };

    utilisateurSelectOption = function(option) {
        this.utilisateurSelect.sendKeys(option);
    };

    getUtilisateurSelect = function() {
        return this.utilisateurSelect;
    };

    getUtilisateurSelectedOption = function() {
        return this.utilisateurSelect.element(by.css('option:checked')).getText();
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
