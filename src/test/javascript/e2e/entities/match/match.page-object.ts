import { element, by, ElementFinder } from 'protractor';

export class MatchComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-match div table .btn-danger'));
  title = element.all(by.css('jhi-match div h2#page-heading span')).first();
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

export class MatchUpdatePage {
  pageTitle = element(by.id('jhi-match-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  dateInput = element(by.id('field_date'));
  statutSelect = element(by.id('field_statut'));
  codeInput = element(by.id('field_code'));
  scoreEquipeDomicileInput = element(by.id('field_scoreEquipeDomicile'));
  scoreEquipeVisiteurInput = element(by.id('field_scoreEquipeVisiteur'));
  phaseCompetitionSelect = element(by.id('field_phaseCompetition'));
  groupeInput = element(by.id('field_groupe'));

  competitionSelect = element(by.id('field_competition'));
  stadeSelect = element(by.id('field_stade'));
  equipeDomicileSelect = element(by.id('field_equipeDomicile'));
  equipeVisiteurSelect = element(by.id('field_equipeVisiteur'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async setStatutSelect(statut: string): Promise<void> {
    await this.statutSelect.sendKeys(statut);
  }

  async getStatutSelect(): Promise<string> {
    return await this.statutSelect.element(by.css('option:checked')).getText();
  }

  async statutSelectLastOption(): Promise<void> {
    await this.statutSelect.all(by.tagName('option')).last().click();
  }

  async setCodeInput(code: string): Promise<void> {
    await this.codeInput.sendKeys(code);
  }

  async getCodeInput(): Promise<string> {
    return await this.codeInput.getAttribute('value');
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

  async setPhaseCompetitionSelect(phaseCompetition: string): Promise<void> {
    await this.phaseCompetitionSelect.sendKeys(phaseCompetition);
  }

  async getPhaseCompetitionSelect(): Promise<string> {
    return await this.phaseCompetitionSelect.element(by.css('option:checked')).getText();
  }

  async phaseCompetitionSelectLastOption(): Promise<void> {
    await this.phaseCompetitionSelect.all(by.tagName('option')).last().click();
  }

  async setGroupeInput(groupe: string): Promise<void> {
    await this.groupeInput.sendKeys(groupe);
  }

  async getGroupeInput(): Promise<string> {
    return await this.groupeInput.getAttribute('value');
  }

  async competitionSelectLastOption(): Promise<void> {
    await this.competitionSelect.all(by.tagName('option')).last().click();
  }

  async competitionSelectOption(option: string): Promise<void> {
    await this.competitionSelect.sendKeys(option);
  }

  getCompetitionSelect(): ElementFinder {
    return this.competitionSelect;
  }

  async getCompetitionSelectedOption(): Promise<string> {
    return await this.competitionSelect.element(by.css('option:checked')).getText();
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

  async equipeDomicileSelectLastOption(): Promise<void> {
    await this.equipeDomicileSelect.all(by.tagName('option')).last().click();
  }

  async equipeDomicileSelectOption(option: string): Promise<void> {
    await this.equipeDomicileSelect.sendKeys(option);
  }

  getEquipeDomicileSelect(): ElementFinder {
    return this.equipeDomicileSelect;
  }

  async getEquipeDomicileSelectedOption(): Promise<string> {
    return await this.equipeDomicileSelect.element(by.css('option:checked')).getText();
  }

  async equipeVisiteurSelectLastOption(): Promise<void> {
    await this.equipeVisiteurSelect.all(by.tagName('option')).last().click();
  }

  async equipeVisiteurSelectOption(option: string): Promise<void> {
    await this.equipeVisiteurSelect.sendKeys(option);
  }

  getEquipeVisiteurSelect(): ElementFinder {
    return this.equipeVisiteurSelect;
  }

  async getEquipeVisiteurSelectedOption(): Promise<string> {
    return await this.equipeVisiteurSelect.element(by.css('option:checked')).getText();
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

export class MatchDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-match-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-match'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
