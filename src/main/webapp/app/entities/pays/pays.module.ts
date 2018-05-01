import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../../shared';
import {
    PaysService,
    PaysPopupService,
    PaysComponent,
    PaysDetailComponent,
    PaysDialogComponent,
    PaysPopupComponent,
    PaysDeletePopupComponent,
    PaysDeleteDialogComponent,
    paysRoute,
    paysPopupRoute,
} from './';

const ENTITY_STATES = [
    ...paysRoute,
    ...paysPopupRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PaysComponent,
        PaysDetailComponent,
        PaysDialogComponent,
        PaysDeleteDialogComponent,
        PaysPopupComponent,
        PaysDeletePopupComponent,
    ],
    entryComponents: [
        PaysComponent,
        PaysDialogComponent,
        PaysPopupComponent,
        PaysDeleteDialogComponent,
        PaysDeletePopupComponent,
    ],
    providers: [
        PaysService,
        PaysPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsPaysModule {}
