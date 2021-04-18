import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { StadeComponentsPage, StadeDeleteDialog, StadeUpdatePage } from './stade.page-object';

const expect = chai.expect;

describe('Stade e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let stadeComponentsPage: StadeComponentsPage;
  let stadeUpdatePage: StadeUpdatePage;
  let stadeDeleteDialog: StadeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Stades', async () => {
    await navBarPage.goToEntity('stade');
    stadeComponentsPage = new StadeComponentsPage();
    await browser.wait(ec.visibilityOf(stadeComponentsPage.title), 5000);
    expect(await stadeComponentsPage.getTitle()).to.eq('pronosticsApp.stade.home.title');
    await browser.wait(ec.or(ec.visibilityOf(stadeComponentsPage.entities), ec.visibilityOf(stadeComponentsPage.noResult)), 1000);
  });

  it('should load create Stade page', async () => {
    await stadeComponentsPage.clickOnCreateButton();
    stadeUpdatePage = new StadeUpdatePage();
    expect(await stadeUpdatePage.getPageTitle()).to.eq('pronosticsApp.stade.home.createOrEditLabel');
    await stadeUpdatePage.cancel();
  });

  it('should create and save Stades', async () => {
    const nbButtonsBeforeCreate = await stadeComponentsPage.countDeleteButtons();

    await stadeComponentsPage.clickOnCreateButton();

    await promise.all([stadeUpdatePage.setNomInput('nom'), stadeUpdatePage.setVilleInput('ville'), stadeUpdatePage.paysSelectLastOption()]);

    expect(await stadeUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await stadeUpdatePage.getVilleInput()).to.eq('ville', 'Expected Ville value to be equals to ville');

    await stadeUpdatePage.save();
    expect(await stadeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await stadeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Stade', async () => {
    const nbButtonsBeforeDelete = await stadeComponentsPage.countDeleteButtons();
    await stadeComponentsPage.clickOnLastDeleteButton();

    stadeDeleteDialog = new StadeDeleteDialog();
    expect(await stadeDeleteDialog.getDialogTitle()).to.eq('pronosticsApp.stade.delete.question');
    await stadeDeleteDialog.clickOnConfirmButton();

    expect(await stadeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
