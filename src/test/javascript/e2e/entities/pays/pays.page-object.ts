import { element, by, ElementFinder } from 'protractor';

export class PaysComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-pays div table .btn-danger'));
  title = element.all(by.css('jhi-pays div h2#page-heading span')).first();
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

export class PaysUpdatePage {
  pageTitle = element(by.id('jhi-pays-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nomInput = element(by.id('field_nom'));
  codeIsoInput = element(by.id('field_codeIso'));
  drapeauInput = element(by.id('file_drapeau'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNomInput(nom: string): Promise<void> {
    await this.nomInput.sendKeys(nom);
  }

  async getNomInput(): Promise<string> {
    return await this.nomInput.getAttribute('value');
  }

  async setCodeIsoInput(codeIso: string): Promise<void> {
    await this.codeIsoInput.sendKeys(codeIso);
  }

  async getCodeIsoInput(): Promise<string> {
    return await this.codeIsoInput.getAttribute('value');
  }

  async setDrapeauInput(drapeau: string): Promise<void> {
    await this.drapeauInput.sendKeys(drapeau);
  }

  async getDrapeauInput(): Promise<string> {
    return await this.drapeauInput.getAttribute('value');
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

export class PaysDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-pays-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-pays'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
