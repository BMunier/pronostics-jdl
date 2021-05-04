import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PronosticComponentsPage, PronosticDeleteDialog, PronosticUpdatePage } from './pronostic.page-object';

const expect = chai.expect;

describe('Pronostic e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pronosticComponentsPage: PronosticComponentsPage;
  let pronosticUpdatePage: PronosticUpdatePage;
  let pronosticDeleteDialog: PronosticDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Pronostics', async () => {
    await navBarPage.goToEntity('pronostic');
    pronosticComponentsPage = new PronosticComponentsPage();
    await browser.wait(ec.visibilityOf(pronosticComponentsPage.title), 5000);
    expect(await pronosticComponentsPage.getTitle()).to.eq('pronosticsApp.pronostic.home.title');
    await browser.wait(ec.or(ec.visibilityOf(pronosticComponentsPage.entities), ec.visibilityOf(pronosticComponentsPage.noResult)), 1000);
  });

  it('should load create Pronostic page', async () => {
    await pronosticComponentsPage.clickOnCreateButton();
    pronosticUpdatePage = new PronosticUpdatePage();
    expect(await pronosticUpdatePage.getPageTitle()).to.eq('pronosticsApp.pronostic.home.createOrEditLabel');
    await pronosticUpdatePage.cancel();
  });

  it('should create and save Pronostics', async () => {
    const nbButtonsBeforeCreate = await pronosticComponentsPage.countDeleteButtons();

    await pronosticComponentsPage.clickOnCreateButton();

    await promise.all([
      pronosticUpdatePage.setScoreEquipeDomicileInput('5'),
      pronosticUpdatePage.setScoreEquipeVisiteurInput('5'),
      pronosticUpdatePage.setPointsInput('5'),
      pronosticUpdatePage.matchSelectLastOption(),
      pronosticUpdatePage.utilisateurSelectLastOption(),
    ]);

    expect(await pronosticUpdatePage.getScoreEquipeDomicileInput()).to.eq('5', 'Expected scoreEquipeDomicile value to be equals to 5');
    expect(await pronosticUpdatePage.getScoreEquipeVisiteurInput()).to.eq('5', 'Expected scoreEquipeVisiteur value to be equals to 5');
    expect(await pronosticUpdatePage.getPointsInput()).to.eq('5', 'Expected points value to be equals to 5');

    await pronosticUpdatePage.save();
    expect(await pronosticUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pronosticComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Pronostic', async () => {
    const nbButtonsBeforeDelete = await pronosticComponentsPage.countDeleteButtons();
    await pronosticComponentsPage.clickOnLastDeleteButton();

    pronosticDeleteDialog = new PronosticDeleteDialog();
    expect(await pronosticDeleteDialog.getDialogTitle()).to.eq('pronosticsApp.pronostic.delete.question');
    await pronosticDeleteDialog.clickOnConfirmButton();

    expect(await pronosticComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
