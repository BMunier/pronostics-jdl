import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from 'app/shared/shared.module';
import { StadeComponent } from './stade.component';
import { StadeDetailComponent } from './stade-detail.component';
import { StadeUpdateComponent } from './stade-update.component';
import { StadeDeleteDialogComponent } from './stade-delete-dialog.component';
import { stadeRoute } from './stade.route';

@NgModule({
  imports: [PronosticsSharedModule, RouterModule.forChild(stadeRoute)],
  declarations: [StadeComponent, StadeDetailComponent, StadeUpdateComponent, StadeDeleteDialogComponent],
  entryComponents: [StadeDeleteDialogComponent],
})
export class PronosticsStadeModule {}
