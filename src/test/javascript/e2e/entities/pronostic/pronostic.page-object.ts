import { element, by, ElementFinder } from 'protractor';

export class PronosticComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-pronostic div table .btn-danger'));
  title = element.all(by.css('jhi-pronostic div h2#page-heading span')).first();
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

export class PronosticUpdatePage {
  pageTitle = element(by.id('jhi-pronostic-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  scoreEquipeDomicileInput = element(by.id('field_scoreEquipeDomicile'));
  scoreEquipeVisiteurInput = element(by.id('field_scoreEquipeVisiteur'));
  pointsInput = element(by.id('field_points'));

  matchSelect = element(by.id('field_match'));
  utilisateurSelect = element(by.id('field_utilisateur'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setScoreEquipeDomicileInput(scoreEquipeDomicile: string): Promise<void> {
    await this.scoreEquipeDomicileInput.sendKeys(scoreEquipeDomicile);
  }

  async getScoreEquipeDomicileInput(): Promise<string> {
    return await this.scoreEquipeDomicileInput.getAttribute('value');
  }

  async setScoreEquipeVisiteurInput(scoreEquipeVisiteur: string): Promise<void> {
    await this.scoreEquipeVisiteurInput.sendKeys(scoreEquipeVisiteur);
  }

  async getScoreEquipeVisiteurInput(): Promise<string> {
    return await this.scoreEquipeVisiteurInput.getAttribute('value');
  }

  async setPointsInput(points: string): Promise<void> {
    await this.pointsInput.sendKeys(points);
  }

  async getPointsInput(): Promise<string> {
    return await this.pointsInput.getAttribute('value');
  }

  async matchSelectLastOption(): Promise<void> {
    await this.matchSelect.all(by.tagName('option')).last().click();
  }

  async matchSelectOption(option: string): Promise<void> {
    await this.matchSelect.sendKeys(option);
  }

  getMatchSelect(): ElementFinder {
    return this.matchSelect;
  }

  async getMatchSelectedOption(): Promise<string> {
    return await this.matchSelect.element(by.css('option:checked')).getText();
  }

  async utilisateurSelectLastOption(): Promise<void> {
    await this.utilisateurSelect.all(by.tagName('option')).last().click();
  }

  async utilisateurSelectOption(option: string): Promise<void> {
    await this.utilisateurSelect.sendKeys(option);
  }

  getUtilisateurSelect(): ElementFinder {
    return this.utilisateurSelect;
  }

  async getUtilisateurSelectedOption(): Promise<string> {
    return await this.utilisateurSelect.element(by.css('option:checked')).getText();
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

export class PronosticDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-pronostic-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-pronostic'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
