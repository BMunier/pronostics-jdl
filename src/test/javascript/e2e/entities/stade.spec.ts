import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Stade e2e test', () => {

    let navBarPage: NavBarPage;
    let stadeDialogPage: StadeDialogPage;
    let stadeComponentsPage: StadeComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Stades', () => {
        navBarPage.goToEntity('stade');
        stadeComponentsPage = new StadeComponentsPage();
        expect(stadeComponentsPage.getTitle())
            .toMatch(/pronosticsApp.stade.home.title/);

    });

    it('should load create Stade dialog', () => {
        stadeComponentsPage.clickOnCreateButton();
        stadeDialogPage = new StadeDialogPage();
        expect(stadeDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.stade.home.createOrEditLabel/);
        stadeDialogPage.close();
    });

    it('should create and save Stades', () => {
        stadeComponentsPage.clickOnCreateButton();
        stadeDialogPage.setNomInput('nom');
        expect(stadeDialogPage.getNomInput()).toMatch('nom');
        stadeDialogPage.setVilleInput('ville');
        expect(stadeDialogPage.getVilleInput()).toMatch('ville');
        stadeDialogPage.paysSelectLastOption();
        stadeDialogPage.save();
        expect(stadeDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class StadeComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-stade div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class StadeDialogPage {
    modalTitle = element(by.css('h4#myStadeLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nomInput = element(by.css('input#field_nom'));
    villeInput = element(by.css('input#field_ville'));
    paysSelect = element(by.css('select#field_pays'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNomInput = function(nom) {
        this.nomInput.sendKeys(nom);
    };

    getNomInput = function() {
        return this.nomInput.getAttribute('value');
    };

    setVilleInput = function(ville) {
        this.villeInput.sendKeys(ville);
    };

    getVilleInput = function() {
        return this.villeInput.getAttribute('value');
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
