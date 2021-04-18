import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PaysComponentsPage, PaysDeleteDialog, PaysUpdatePage } from './pays.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Pays e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let paysComponentsPage: PaysComponentsPage;
  let paysUpdatePage: PaysUpdatePage;
  let paysDeleteDialog: PaysDeleteDialog;
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Pays', async () => {
    await navBarPage.goToEntity('pays');
    paysComponentsPage = new PaysComponentsPage();
    await browser.wait(ec.visibilityOf(paysComponentsPage.title), 5000);
    expect(await paysComponentsPage.getTitle()).to.eq('pronosticsApp.pays.home.title');
    await browser.wait(ec.or(ec.visibilityOf(paysComponentsPage.entities), ec.visibilityOf(paysComponentsPage.noResult)), 1000);
  });

  it('should load create Pays page', async () => {
    await paysComponentsPage.clickOnCreateButton();
    paysUpdatePage = new PaysUpdatePage();
    expect(await paysUpdatePage.getPageTitle()).to.eq('pronosticsApp.pays.home.createOrEditLabel');
    await paysUpdatePage.cancel();
  });

  it('should create and save Pays', async () => {
    const nbButtonsBeforeCreate = await paysComponentsPage.countDeleteButtons();

    await paysComponentsPage.clickOnCreateButton();

    await promise.all([
      paysUpdatePage.setNomInput('nom'),
      paysUpdatePage.setCodeIsoInput('codeIso'),
      paysUpdatePage.setDrapeauInput(absolutePath),
    ]);

    expect(await paysUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await paysUpdatePage.getCodeIsoInput()).to.eq('codeIso', 'Expected CodeIso value to be equals to codeIso');
    expect(await paysUpdatePage.getDrapeauInput()).to.endsWith(
      fileNameToUpload,
      'Expected Drapeau value to be end with ' + fileNameToUpload
    );

    await paysUpdatePage.save();
    expect(await paysUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await paysComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Pays', async () => {
    const nbButtonsBeforeDelete = await paysComponentsPage.countDeleteButtons();
    await paysComponentsPage.clickOnLastDeleteButton();

    paysDeleteDialog = new PaysDeleteDialog();
    expect(await paysDeleteDialog.getDialogTitle()).to.eq('pronosticsApp.pays.delete.question');
    await paysDeleteDialog.clickOnConfirmButton();

    expect(await paysComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
