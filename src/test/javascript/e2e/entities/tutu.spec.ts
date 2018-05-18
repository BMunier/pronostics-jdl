import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Tutu e2e test', () => {

    let navBarPage: NavBarPage;
    let tutuDialogPage: TutuDialogPage;
    let tutuComponentsPage: TutuComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Tutus', () => {
        navBarPage.goToEntity('tutu');
        tutuComponentsPage = new TutuComponentsPage();
        expect(tutuComponentsPage.getTitle())
            .toMatch(/pronosticsApp.tutu.home.title/);

    });

    it('should load create Tutu dialog', () => {
        tutuComponentsPage.clickOnCreateButton();
        tutuDialogPage = new TutuDialogPage();
        expect(tutuDialogPage.getModalTitle())
            .toMatch(/pronosticsApp.tutu.home.createOrEditLabel/);
        tutuDialogPage.close();
    });

    it('should create and save Tutus', () => {
        tutuComponentsPage.clickOnCreateButton();
        tutuDialogPage.setDateInput(12310020012301);
        expect(tutuDialogPage.getDateInput()).toMatch('2001-12-31T02:30');
        tutuDialogPage.totoSelectLastOption();
        tutuDialogPage.save();
        expect(tutuDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class TutuComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-tutu div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class TutuDialogPage {
    modalTitle = element(by.css('h4#myTutuLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    dateInput = element(by.css('input#field_date'));
    totoSelect = element(by.css('select#field_toto'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setDateInput = function(date) {
        this.dateInput.sendKeys(date);
    };

    getDateInput = function() {
        return this.dateInput.getAttribute('value');
    };

    totoSelectLastOption = function() {
        this.totoSelect.all(by.tagName('option')).last().click();
    };

    totoSelectOption = function(option) {
        this.totoSelect.sendKeys(option);
    };

    getTotoSelect = function() {
        return this.totoSelect;
    };

    getTotoSelectedOption = function() {
        return this.totoSelect.element(by.css('option:checked')).getText();
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
