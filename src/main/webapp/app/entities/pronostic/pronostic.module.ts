import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../../shared';
import { PronosticsAdminModule } from '../../admin/admin.module';
import {
    PronosticService,
    PronosticPopupService,
    PronosticComponent,
    PronosticDetailComponent,
    PronosticDialogComponent,
    PronosticPopupComponent,
    PronosticDeletePopupComponent,
    PronosticDeleteDialogComponent,
    pronosticRoute,
    pronosticPopupRoute,
} from './';

const ENTITY_STATES = [
    ...pronosticRoute,
    ...pronosticPopupRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        PronosticsAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PronosticComponent,
        PronosticDetailComponent,
        PronosticDialogComponent,
        PronosticDeleteDialogComponent,
        PronosticPopupComponent,
        PronosticDeletePopupComponent,
    ],
    entryComponents: [
        PronosticComponent,
        PronosticDialogComponent,
        PronosticPopupComponent,
        PronosticDeleteDialogComponent,
        PronosticDeletePopupComponent,
    ],
    providers: [
        PronosticService,
        PronosticPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsPronosticModule {}
