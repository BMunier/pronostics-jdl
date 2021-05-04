import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MatchComponentsPage, MatchDeleteDialog, MatchUpdatePage } from './match.page-object';

const expect = chai.expect;

describe('Match e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let matchComponentsPage: MatchComponentsPage;
  let matchUpdatePage: MatchUpdatePage;
  let matchDeleteDialog: MatchDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Matches', async () => {
    await navBarPage.goToEntity('match');
    matchComponentsPage = new MatchComponentsPage();
    await browser.wait(ec.visibilityOf(matchComponentsPage.title), 5000);
    expect(await matchComponentsPage.getTitle()).to.eq('pronosticsApp.match.home.title');
    await browser.wait(ec.or(ec.visibilityOf(matchComponentsPage.entities), ec.visibilityOf(matchComponentsPage.noResult)), 1000);
  });

  it('should load create Match page', async () => {
    await matchComponentsPage.clickOnCreateButton();
    matchUpdatePage = new MatchUpdatePage();
    expect(await matchUpdatePage.getPageTitle()).to.eq('pronosticsApp.match.home.createOrEditLabel');
    await matchUpdatePage.cancel();
  });

  it('should create and save Matches', async () => {
    const nbButtonsBeforeCreate = await matchComponentsPage.countDeleteButtons();

    await matchComponentsPage.clickOnCreateButton();

    await promise.all([
      matchUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      matchUpdatePage.statutSelectLastOption(),
      matchUpdatePage.setCodeInput('code'),
      matchUpdatePage.setScoreEquipeDomicileInput('5'),
      matchUpdatePage.setScoreEquipeVisiteurInput('5'),
      matchUpdatePage.phaseCompetitionSelectLastOption(),
      matchUpdatePage.setGroupeInput('groupe'),
      matchUpdatePage.competitionSelectLastOption(),
      matchUpdatePage.stadeSelectLastOption(),
      matchUpdatePage.equipeDomicileSelectLastOption(),
      matchUpdatePage.equipeVisiteurSelectLastOption(),
    ]);

    expect(await matchUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');
    expect(await matchUpdatePage.getCodeInput()).to.eq('code', 'Expected Code value to be equals to code');
    expect(await matchUpdatePage.getScoreEquipeDomicileInput()).to.eq('5', 'Expected scoreEquipeDomicile value to be equals to 5');
    expect(await matchUpdatePage.getScoreEquipeVisiteurInput()).to.eq('5', 'Expected scoreEquipeVisiteur value to be equals to 5');
    expect(await matchUpdatePage.getGroupeInput()).to.eq('groupe', 'Expected Groupe value to be equals to groupe');

    await matchUpdatePage.save();
    expect(await matchUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await matchComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Match', async () => {
    const nbButtonsBeforeDelete = await matchComponentsPage.countDeleteButtons();
    await matchComponentsPage.clickOnLastDeleteButton();

    matchDeleteDialog = new MatchDeleteDialog();
    expect(await matchDeleteDialog.getDialogTitle()).to.eq('pronosticsApp.match.delete.question');
    await matchDeleteDialog.clickOnConfirmButton();

    expect(await matchComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
