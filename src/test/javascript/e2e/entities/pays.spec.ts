import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
import * as path from 'path';
describe('Pays e2e test', () => {

    let navBarPage: NavBarPage;
    let paysDialogPage: PaysDialogPage;
    let paysComponentsPage: PaysComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Pays', () => {
        navBarPage.goToEntity('pays');
        paysComponentsPage = new PaysComponentsPage();
        expect(paysComponentsPage.getTitle())
            .toMatch(/pronosticsApp.pays.home.title/);

    });

    it('should load create Pays dialog', () => {
        paysComponentsPage.clickOnCreateButton();
        paysDialogPage = new PaysDialogPage();
        expect(paysDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.pays.home.createOrEditLabel/);
        paysDialogPage.close();
    });

    it('should create and save Pays', () => {
        paysComponentsPage.clickOnCreateButton();
        paysDialogPage.setNomInput('nom');
        expect(paysDialogPage.getNomInput()).toMatch('nom');
        paysDialogPage.setCodeIsoInput('codeIso');
        expect(paysDialogPage.getCodeIsoInput()).toMatch('codeIso');
        paysDialogPage.setDrapeauInput(absolutePath);
        paysDialogPage.save();
        expect(paysDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PaysComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-pays div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaysDialogPage {
    modalTitle = element(by.css('h4#myPaysLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nomInput = element(by.css('input#field_nom'));
    codeIsoInput = element(by.css('input#field_codeIso'));
    drapeauInput = element(by.css('input#file_drapeau'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNomInput = function(nom) {
        this.nomInput.sendKeys(nom);
    };

    getNomInput = function() {
        return this.nomInput.getAttribute('value');
    };

    setCodeIsoInput = function(codeIso) {
        this.codeIsoInput.sendKeys(codeIso);
    };

    getCodeIsoInput = function() {
        return this.codeIsoInput.getAttribute('value');
    };

    setDrapeauInput = function(drapeau) {
        this.drapeauInput.sendKeys(drapeau);
    };

    getDrapeauInput = function() {
        return this.drapeauInput.getAttribute('value');
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
