import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../../shared';
import {
    TutuService,
    TutuPopupService,
    TutuComponent,
    TutuDetailComponent,
    TutuDialogComponent,
    TutuPopupComponent,
    TutuDeletePopupComponent,
    TutuDeleteDialogComponent,
    tutuRoute,
    tutuPopupRoute,
} from './';

const ENTITY_STATES = [
    ...tutuRoute,
    ...tutuPopupRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TutuComponent,
        TutuDetailComponent,
        TutuDialogComponent,
        TutuDeleteDialogComponent,
        TutuPopupComponent,
        TutuDeletePopupComponent,
    ],
    entryComponents: [
        TutuComponent,
        TutuDialogComponent,
        TutuPopupComponent,
        TutuDeleteDialogComponent,
        TutuDeletePopupComponent,
    ],
    providers: [
        TutuService,
        TutuPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsTutuModule {}
