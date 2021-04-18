import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CompetitionComponentsPage, CompetitionDeleteDialog, CompetitionUpdatePage } from './competition.page-object';

const expect = chai.expect;

describe('Competition e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let competitionComponentsPage: CompetitionComponentsPage;
  let competitionUpdatePage: CompetitionUpdatePage;
  let competitionDeleteDialog: CompetitionDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Competitions', async () => {
    await navBarPage.goToEntity('competition');
    competitionComponentsPage = new CompetitionComponentsPage();
    await browser.wait(ec.visibilityOf(competitionComponentsPage.title), 5000);
    expect(await competitionComponentsPage.getTitle()).to.eq('pronosticsApp.competition.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(competitionComponentsPage.entities), ec.visibilityOf(competitionComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Competition page', async () => {
    await competitionComponentsPage.clickOnCreateButton();
    competitionUpdatePage = new CompetitionUpdatePage();
    expect(await competitionUpdatePage.getPageTitle()).to.eq('pronosticsApp.competition.home.createOrEditLabel');
    await competitionUpdatePage.cancel();
  });

  it('should create and save Competitions', async () => {
    const nbButtonsBeforeCreate = await competitionComponentsPage.countDeleteButtons();

    await competitionComponentsPage.clickOnCreateButton();

    await promise.all([
      competitionUpdatePage.setNomInput('nom'),
      competitionUpdatePage.setDescriptionInput('description'),
      competitionUpdatePage.setDateDebutInput('2000-12-31'),
      competitionUpdatePage.setDateFinInput('2000-12-31'),
      // competitionUpdatePage.equipeSelectLastOption(),
      // competitionUpdatePage.paysSelectLastOption(),
      // competitionUpdatePage.stadeSelectLastOption(),
    ]);

    expect(await competitionUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await competitionUpdatePage.getDescriptionInput()).to.eq(
      'description',
      'Expected Description value to be equals to description'
    );
    expect(await competitionUpdatePage.getDateDebutInput()).to.eq('2000-12-31', 'Expected dateDebut value to be equals to 2000-12-31');
    expect(await competitionUpdatePage.getDateFinInput()).to.eq('2000-12-31', 'Expected dateFin value to be equals to 2000-12-31');

    await competitionUpdatePage.save();
    expect(await competitionUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await competitionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Competition', async () => {
    const nbButtonsBeforeDelete = await competitionComponentsPage.countDeleteButtons();
    await competitionComponentsPage.clickOnLastDeleteButton();

    competitionDeleteDialog = new CompetitionDeleteDialog();
    expect(await competitionDeleteDialog.getDialogTitle()).to.eq('pronosticsApp.competition.delete.question');
    await competitionDeleteDialog.clickOnConfirmButton();

    expect(await competitionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
