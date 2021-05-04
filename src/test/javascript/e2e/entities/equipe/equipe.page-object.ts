import { element, by, ElementFinder } from 'protractor';

export class EquipeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-equipe div table .btn-danger'));
  title = element.all(by.css('jhi-equipe div h2#page-heading span')).first();
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

export class EquipeUpdatePage {
  pageTitle = element(by.id('jhi-equipe-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  codeEquipeInput = element(by.id('field_codeEquipe'));
  nomEquipeInput = element(by.id('field_nomEquipe'));
  rangFifaInput = element(by.id('field_rangFifa'));
  ecussonInput = element(by.id('file_ecusson'));

  paysSelect = element(by.id('field_pays'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setCodeEquipeInput(codeEquipe: string): Promise<void> {
    await this.codeEquipeInput.sendKeys(codeEquipe);
  }

  async getCodeEquipeInput(): Promise<string> {
    return await this.codeEquipeInput.getAttribute('value');
  }

  async setNomEquipeInput(nomEquipe: string): Promise<void> {
    await this.nomEquipeInput.sendKeys(nomEquipe);
  }

  async getNomEquipeInput(): Promise<string> {
    return await this.nomEquipeInput.getAttribute('value');
  }

  async setRangFifaInput(rangFifa: string): Promise<void> {
    await this.rangFifaInput.sendKeys(rangFifa);
  }

  async getRangFifaInput(): Promise<string> {
    return await this.rangFifaInput.getAttribute('value');
  }

  async setEcussonInput(ecusson: string): Promise<void> {
    await this.ecussonInput.sendKeys(ecusson);
  }

  async getEcussonInput(): Promise<string> {
    return await this.ecussonInput.getAttribute('value');
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

export class EquipeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-equipe-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-equipe'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
