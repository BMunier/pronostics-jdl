import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { PronosticsSharedModule } from 'app/shared/shared.module';
import { PronosticsCoreModule } from 'app/core/core.module';
import { PronosticsAppRoutingModule } from './app-routing.module';
import { PronosticsHomeModule } from './home/home.module';
import { AccountModule } from './account/account.module';
import { PronosticsPageSetsModule } from './pages/page-sets.module';
import { PronosticsEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    PronosticsSharedModule,
    PronosticsCoreModule,
    PronosticsHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    PronosticsEntityModule,
    PronosticsAppRoutingModule,
    PronosticsPageSetsModule,
    AccountModule,
    PronosticsEntityModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class PronosticsAppModule {}
