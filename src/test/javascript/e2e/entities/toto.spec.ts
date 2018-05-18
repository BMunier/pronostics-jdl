import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Toto e2e test', () => {

    let navBarPage: NavBarPage;
    let totoDialogPage: TotoDialogPage;
    let totoComponentsPage: TotoComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Totos', () => {
        navBarPage.goToEntity('toto');
        totoComponentsPage = new TotoComponentsPage();
        expect(totoComponentsPage.getTitle())
            .toMatch(/pronosticsApp.toto.home.title/);

    });

    it('should load create Toto dialog', () => {
        totoComponentsPage.clickOnCreateButton();
        totoDialogPage = new TotoDialogPage();
        expect(totoDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.toto.home.createOrEditLabel/);
        totoDialogPage.close();
    });

    it('should create and save Totos', () => {
        totoComponentsPage.clickOnCreateButton();
        totoDialogPage.setNomInput('nom');
        expect(totoDialogPage.getNomInput()).toMatch('nom');
        totoDialogPage.setPrenomInput('prenom');
        expect(totoDialogPage.getPrenomInput()).toMatch('prenom');
        totoDialogPage.setAgeInput('age');
        expect(totoDialogPage.getAgeInput()).toMatch('age');
        totoDialogPage.save();
        expect(totoDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class TotoComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-toto div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class TotoDialogPage {
    modalTitle = element(by.css('h4#myTotoLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nomInput = element(by.css('input#field_nom'));
    prenomInput = element(by.css('input#field_prenom'));
    ageInput = element(by.css('input#field_age'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNomInput = function(nom) {
        this.nomInput.sendKeys(nom);
    };

    getNomInput = function() {
        return this.nomInput.getAttribute('value');
    };

    setPrenomInput = function(prenom) {
        this.prenomInput.sendKeys(prenom);
    };

    getPrenomInput = function() {
        return this.prenomInput.getAttribute('value');
    };

    setAgeInput = function(age) {
        this.ageInput.sendKeys(age);
    };

    getAgeInput = function() {
        return this.ageInput.getAttribute('value');
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
