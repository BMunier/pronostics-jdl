import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from 'app/shared/shared.module';
import { PronosticComponent } from './pronostic.component';
import { PronosticDetailComponent } from './pronostic-detail.component';
import { PronosticUpdateComponent } from './pronostic-update.component';
import { PronosticDeleteDialogComponent } from './pronostic-delete-dialog.component';
import { pronosticRoute } from './pronostic.route';

@NgModule({
  imports: [PronosticsSharedModule, RouterModule.forChild(pronosticRoute)],
  declarations: [PronosticComponent, PronosticDetailComponent, PronosticUpdateComponent, PronosticDeleteDialogComponent],
  entryComponents: [PronosticDeleteDialogComponent],
})
export class PronosticsPronosticModule {}
