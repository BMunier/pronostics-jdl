import { element, by, ElementFinder } from 'protractor';

export class CompetitionComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-competition div table .btn-danger'));
  title = element.all(by.css('jhi-competition div h2#page-heading span')).first();
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

export class CompetitionUpdatePage {
  pageTitle = element(by.id('jhi-competition-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nomInput = element(by.id('field_nom'));
  descriptionInput = element(by.id('field_description'));
  dateDebutInput = element(by.id('field_dateDebut'));
  dateFinInput = element(by.id('field_dateFin'));

  equipeSelect = element(by.id('field_equipe'));
  paysSelect = element(by.id('field_pays'));
  stadeSelect = element(by.id('field_stade'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNomInput(nom: string): Promise<void> {
    await this.nomInput.sendKeys(nom);
  }

  async getNomInput(): Promise<string> {
    return await this.nomInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setDateDebutInput(dateDebut: string): Promise<void> {
    await this.dateDebutInput.sendKeys(dateDebut);
  }

  async getDateDebutInput(): Promise<string> {
    return await this.dateDebutInput.getAttribute('value');
  }

  async setDateFinInput(dateFin: string): Promise<void> {
    await this.dateFinInput.sendKeys(dateFin);
  }

  async getDateFinInput(): Promise<string> {
    return await this.dateFinInput.getAttribute('value');
  }

  async equipeSelectLastOption(): Promise<void> {
    await this.equipeSelect.all(by.tagName('option')).last().click();
  }

  async equipeSelectOption(option: string): Promise<void> {
    await this.equipeSelect.sendKeys(option);
  }

  getEquipeSelect(): ElementFinder {
    return this.equipeSelect;
  }

  async getEquipeSelectedOption(): Promise<string> {
    return await this.equipeSelect.element(by.css('option:checked')).getText();
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

  async stadeSelectLastOption(): Promise<void> {
    await this.stadeSelect.all(by.tagName('option')).last().click();
  }

  async stadeSelectOption(option: string): Promise<void> {
    await this.stadeSelect.sendKeys(option);
  }

  getStadeSelect(): ElementFinder {
    return this.stadeSelect;
  }

  async getStadeSelectedOption(): Promise<string> {
    return await this.stadeSelect.element(by.css('option:checked')).getText();
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

export class CompetitionDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-competition-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-competition'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
