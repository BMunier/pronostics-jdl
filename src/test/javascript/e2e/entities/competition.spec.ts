import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Competition e2e test', () => {

    let navBarPage: NavBarPage;
    let competitionDialogPage: CompetitionDialogPage;
    let competitionComponentsPage: CompetitionComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Competitions', () => {
        navBarPage.goToEntity('competition');
        competitionComponentsPage = new CompetitionComponentsPage();
        expect(competitionComponentsPage.getTitle())
            .toMatch(/pronosticsApp.competition.home.title/);

    });

    it('should load create Competition dialog', () => {
        competitionComponentsPage.clickOnCreateButton();
        competitionDialogPage = new CompetitionDialogPage();
        expect(competitionDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.competition.home.createOrEditLabel/);
        competitionDialogPage.close();
    });

    it('should create and save Competitions', () => {
        competitionComponentsPage.clickOnCreateButton();
        competitionDialogPage.setNomInput('nom');
        expect(competitionDialogPage.getNomInput()).toMatch('nom');
        competitionDialogPage.setDescriptionInput('description');
        expect(competitionDialogPage.getDescriptionInput()).toMatch('description');
        competitionDialogPage.setDateDebutInput(12310020012301);
        expect(competitionDialogPage.getDateDebutInput()).toMatch('2001-12-31T02:30');
        competitionDialogPage.setDateFinInput(12310020012301);
        expect(competitionDialogPage.getDateFinInput()).toMatch('2001-12-31T02:30');
        competitionDialogPage.paysSelectLastOption();
        // competitionDialogPage.equipeSelectLastOption();
        competitionDialogPage.save();
        expect(competitionDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CompetitionComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-competition div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CompetitionDialogPage {
    modalTitle = element(by.css('h4#myCompetitionLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nomInput = element(by.css('input#field_nom'));
    descriptionInput = element(by.css('input#field_description'));
    dateDebutInput = element(by.css('input#field_dateDebut'));
    dateFinInput = element(by.css('input#field_dateFin'));
    paysSelect = element(by.css('select#field_pays'));
    equipeSelect = element(by.css('select#field_equipe'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNomInput = function(nom) {
        this.nomInput.sendKeys(nom);
    };

    getNomInput = function() {
        return this.nomInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
    };

    setDateDebutInput = function(dateDebut) {
        this.dateDebutInput.sendKeys(dateDebut);
    };

    getDateDebutInput = function() {
        return this.dateDebutInput.getAttribute('value');
    };

    setDateFinInput = function(dateFin) {
        this.dateFinInput.sendKeys(dateFin);
    };

    getDateFinInput = function() {
        return this.dateFinInput.getAttribute('value');
    };

    paysSelectLastOption = function() {
        this.paysSelect.all(by.tagName('option')).last().click();
    };

    paysSelectOption = function(option) {
        this.paysSelect.sendKeys(option);
    };

    getPaysSelect = function() {
        return this.paysSelect;
    };

    getPaysSelectedOption = function() {
        return this.paysSelect.element(by.css('option:checked')).getText();
    };

    equipeSelectLastOption = function() {
        this.equipeSelect.all(by.tagName('option')).last().click();
    };

    equipeSelectOption = function(option) {
        this.equipeSelect.sendKeys(option);
    };

    getEquipeSelect = function() {
        return this.equipeSelect;
    };

    getEquipeSelectedOption = function() {
        return this.equipeSelect.element(by.css('option:checked')).getText();
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
