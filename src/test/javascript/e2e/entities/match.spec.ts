import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Match e2e test', () => {

    let navBarPage: NavBarPage;
    let matchDialogPage: MatchDialogPage;
    let matchComponentsPage: MatchComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Matches', () => {
        navBarPage.goToEntity('match');
        matchComponentsPage = new MatchComponentsPage();
        expect(matchComponentsPage.getTitle())
            .toMatch(/pronosticsApp.match.home.title/);

    });

    it('should load create Match dialog', () => {
        matchComponentsPage.clickOnCreateButton();
        matchDialogPage = new MatchDialogPage();
        expect(matchDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.match.home.createOrEditLabel/);
        matchDialogPage.close();
    });

    it('should create and save Matches', () => {
        matchComponentsPage.clickOnCreateButton();
        matchDialogPage.setDateInput(12310020012301);
        expect(matchDialogPage.getDateInput()).toMatch('2001-12-31T02:30');
        matchDialogPage.statutSelectLastOption();
        matchDialogPage.setScoreEquipeDomicileInput('5');
        expect(matchDialogPage.getScoreEquipeDomicileInput()).toMatch('5');
        matchDialogPage.setScoreEquipeVisiteurInput('5');
        expect(matchDialogPage.getScoreEquipeVisiteurInput()).toMatch('5');
        matchDialogPage.phaseCompetitionSelectLastOption();
        matchDialogPage.setGroupeInput('groupe');
        expect(matchDialogPage.getGroupeInput()).toMatch('groupe');
        matchDialogPage.competitionSelectLastOption();
        matchDialogPage.stadeSelectLastOption();
        matchDialogPage.equipeDomicileSelectLastOption();
        matchDialogPage.equipeVisiteurSelectLastOption();
        matchDialogPage.save();
        expect(matchDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MatchComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-match div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MatchDialogPage {
    modalTitle = element(by.css('h4#myMatchLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    dateInput = element(by.css('input#field_date'));
    statutSelect = element(by.css('select#field_statut'));
    scoreEquipeDomicileInput = element(by.css('input#field_scoreEquipeDomicile'));
    scoreEquipeVisiteurInput = element(by.css('input#field_scoreEquipeVisiteur'));
    phaseCompetitionSelect = element(by.css('select#field_phaseCompetition'));
    groupeInput = element(by.css('input#field_groupe'));
    competitionSelect = element(by.css('select#field_competition'));
    stadeSelect = element(by.css('select#field_stade'));
    equipeDomicileSelect = element(by.css('select#field_equipeDomicile'));
    equipeVisiteurSelect = element(by.css('select#field_equipeVisiteur'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setDateInput = function(date) {
        this.dateInput.sendKeys(date);
    };

    getDateInput = function() {
        return this.dateInput.getAttribute('value');
    };

    setStatutSelect = function(statut) {
        this.statutSelect.sendKeys(statut);
    };

    getStatutSelect = function() {
        return this.statutSelect.element(by.css('option:checked')).getText();
    };

    statutSelectLastOption = function() {
        this.statutSelect.all(by.tagName('option')).last().click();
    };
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

    setPhaseCompetitionSelect = function(phaseCompetition) {
        this.phaseCompetitionSelect.sendKeys(phaseCompetition);
    };

    getPhaseCompetitionSelect = function() {
        return this.phaseCompetitionSelect.element(by.css('option:checked')).getText();
    };

    phaseCompetitionSelectLastOption = function() {
        this.phaseCompetitionSelect.all(by.tagName('option')).last().click();
    };
    setGroupeInput = function(groupe) {
        this.groupeInput.sendKeys(groupe);
    };

    getGroupeInput = function() {
        return this.groupeInput.getAttribute('value');
    };

    competitionSelectLastOption = function() {
        this.competitionSelect.all(by.tagName('option')).last().click();
    };

    competitionSelectOption = function(option) {
        this.competitionSelect.sendKeys(option);
    };

    getCompetitionSelect = function() {
        return this.competitionSelect;
    };

    getCompetitionSelectedOption = function() {
        return this.competitionSelect.element(by.css('option:checked')).getText();
    };

    stadeSelectLastOption = function() {
        this.stadeSelect.all(by.tagName('option')).last().click();
    };

    stadeSelectOption = function(option) {
        this.stadeSelect.sendKeys(option);
    };

    getStadeSelect = function() {
        return this.stadeSelect;
    };

    getStadeSelectedOption = function() {
        return this.stadeSelect.element(by.css('option:checked')).getText();
    };

    equipeDomicileSelectLastOption = function() {
        this.equipeDomicileSelect.all(by.tagName('option')).last().click();
    };

    equipeDomicileSelectOption = function(option) {
        this.equipeDomicileSelect.sendKeys(option);
    };

    getEquipeDomicileSelect = function() {
        return this.equipeDomicileSelect;
    };

    getEquipeDomicileSelectedOption = function() {
        return this.equipeDomicileSelect.element(by.css('option:checked')).getText();
    };

    equipeVisiteurSelectLastOption = function() {
        this.equipeVisiteurSelect.all(by.tagName('option')).last().click();
    };

    equipeVisiteurSelectOption = function(option) {
        this.equipeVisiteurSelect.sendKeys(option);
    };

    getEquipeVisiteurSelect = function() {
        return this.equipeVisiteurSelect;
    };

    getEquipeVisiteurSelectedOption = function() {
        return this.equipeVisiteurSelect.element(by.css('option:checked')).getText();
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
