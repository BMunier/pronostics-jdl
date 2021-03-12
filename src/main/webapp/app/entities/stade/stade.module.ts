import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../../shared';
import {
    StadeService,
    StadePopupService,
    StadeComponent,
    StadeDetailComponent,
    StadeDialogComponent,
    StadePopupComponent,
    StadeDeletePopupComponent,
    StadeDeleteDialogComponent,
    stadeRoute,
    stadePopupRoute,
} from './';

const ENTITY_STATES = [
    ...stadeRoute,
    ...stadePopupRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        StadeComponent,
        StadeDetailComponent,
        StadeDialogComponent,
        StadeDeleteDialogComponent,
        StadePopupComponent,
        StadeDeletePopupComponent,
    ],
    entryComponents: [
        StadeComponent,
        StadeDialogComponent,
        StadePopupComponent,
        StadeDeleteDialogComponent,
        StadeDeletePopupComponent,
    ],
    providers: [
        StadeService,
        StadePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsStadeModule {}
