import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
import * as path from 'path';
describe('Equipe e2e test', () => {

    let navBarPage: NavBarPage;
    let equipeDialogPage: EquipeDialogPage;
    let equipeComponentsPage: EquipeComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Equipes', () => {
        navBarPage.goToEntity('equipe');
        equipeComponentsPage = new EquipeComponentsPage();
        expect(equipeComponentsPage.getTitle())
            .toMatch(/pronosticsApp.equipe.home.title/);

    });

    it('should load create Equipe dialog', () => {
        equipeComponentsPage.clickOnCreateButton();
        equipeDialogPage = new EquipeDialogPage();
        expect(equipeDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.equipe.home.createOrEditLabel/);
        equipeDialogPage.close();
    });

    it('should create and save Equipes', () => {
        equipeComponentsPage.clickOnCreateButton();
        equipeDialogPage.setCodeEquipeInput('codeEquipe');
        expect(equipeDialogPage.getCodeEquipeInput()).toMatch('codeEquipe');
        equipeDialogPage.setRangFifaInput('5');
        expect(equipeDialogPage.getRangFifaInput()).toMatch('5');
        equipeDialogPage.setEcussonInput(absolutePath);
        equipeDialogPage.paysSelectLastOption();
        equipeDialogPage.save();
        expect(equipeDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class EquipeComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-equipe div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class EquipeDialogPage {
    modalTitle = element(by.css('h4#myEquipeLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    codeEquipeInput = element(by.css('input#field_codeEquipe'));
    rangFifaInput = element(by.css('input#field_rangFifa'));
    ecussonInput = element(by.css('input#file_ecusson'));
    paysSelect = element(by.css('select#field_pays'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setCodeEquipeInput = function(codeEquipe) {
        this.codeEquipeInput.sendKeys(codeEquipe);
    };

    getCodeEquipeInput = function() {
        return this.codeEquipeInput.getAttribute('value');
    };

    setRangFifaInput = function(rangFifa) {
        this.rangFifaInput.sendKeys(rangFifa);
    };

    getRangFifaInput = function() {
        return this.rangFifaInput.getAttribute('value');
    };

    setEcussonInput = function(ecusson) {
        this.ecussonInput.sendKeys(ecusson);
    };

    getEcussonInput = function() {
        return this.ecussonInput.getAttribute('value');
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
