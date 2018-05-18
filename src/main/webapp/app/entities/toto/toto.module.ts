import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../../shared';
import {
    TotoService,
    TotoPopupService,
    TotoComponent,
    TotoDetailComponent,
    TotoDialogComponent,
    TotoPopupComponent,
    TotoDeletePopupComponent,
    TotoDeleteDialogComponent,
    totoRoute,
    totoPopupRoute,
} from './';

const ENTITY_STATES = [
    ...totoRoute,
    ...totoPopupRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TotoComponent,
        TotoDetailComponent,
        TotoDialogComponent,
        TotoDeleteDialogComponent,
        TotoPopupComponent,
        TotoDeletePopupComponent,
    ],
    entryComponents: [
        TotoComponent,
        TotoDialogComponent,
        TotoPopupComponent,
        TotoDeleteDialogComponent,
        TotoDeletePopupComponent,
    ],
    providers: [
        TotoService,
        TotoPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsTotoModule {}
