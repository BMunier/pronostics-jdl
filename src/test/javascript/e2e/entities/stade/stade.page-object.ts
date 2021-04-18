import { element, by, ElementFinder } from 'protractor';

export class StadeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-stade div table .btn-danger'));
  title = element.all(by.css('jhi-stade div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class StadeUpdatePage {
  pageTitle = element(by.id('jhi-stade-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nomInput = element(by.id('field_nom'));
  villeInput = element(by.id('field_ville'));

  paysSelect = element(by.id('field_pays'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNomInput(nom: string): Promise<void> {
    await this.nomInput.sendKeys(nom);
  }

  async getNomInput(): Promise<string> {
    return await this.nomInput.getAttribute('value');
  }

  async setVilleInput(ville: string): Promise<void> {
    await this.villeInput.sendKeys(ville);
  }

  async getVilleInput(): Promise<string> {
    return await this.villeInput.getAttribute('value');
  }

  async paysSelectLastOption(): Promise<void> {
    await this.paysSelect.all(by.tagName('option')).last().click();
  }

  async paysSelectOption(option: string): Promise<void> {
    await this.paysSelect.sendKeys(option);
  }

  getPaysSelect(): ElementFinder {
    return this.paysSelect;
  }

  async getPaysSelectedOption(): Promise<string> {
    return await this.paysSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class StadeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-stade-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-stade'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
