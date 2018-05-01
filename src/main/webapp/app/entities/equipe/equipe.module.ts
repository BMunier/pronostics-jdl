import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../../shared';
import {
    EquipeService,
    EquipePopupService,
    EquipeComponent,
    EquipeDetailComponent,
    EquipeDialogComponent,
    EquipePopupComponent,
    EquipeDeletePopupComponent,
    EquipeDeleteDialogComponent,
    equipeRoute,
    equipePopupRoute,
} from './';

const ENTITY_STATES = [
    ...equipeRoute,
    ...equipePopupRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        EquipeComponent,
        EquipeDetailComponent,
        EquipeDialogComponent,
        EquipeDeleteDialogComponent,
        EquipePopupComponent,
        EquipeDeletePopupComponent,
    ],
    entryComponents: [
        EquipeComponent,
        EquipeDialogComponent,
        EquipePopupComponent,
        EquipeDeleteDialogComponent,
        EquipeDeletePopupComponent,
    ],
    providers: [
        EquipeService,
        EquipePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsEquipeModule {}
