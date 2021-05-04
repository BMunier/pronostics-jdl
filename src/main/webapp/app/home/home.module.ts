import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { ClassementComponent, PronosticSaisieComponent, PronosticSaisieService } from '.';
import { ClassementService } from './classement/classement.service';

@NgModule({
  imports: [PronosticsSharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent, PronosticSaisieComponent, ClassementComponent],
  providers: [PronosticSaisieService,ClassementService],
})
export class PronosticsHomeModule {}
