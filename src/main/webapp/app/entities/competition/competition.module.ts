import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../../shared';
import {
    CompetitionService,
    CompetitionPopupService,
    CompetitionComponent,
    CompetitionDetailComponent,
    CompetitionDialogComponent,
    CompetitionPopupComponent,
    CompetitionDeletePopupComponent,
    CompetitionDeleteDialogComponent,
    competitionRoute,
    competitionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...competitionRoute,
    ...competitionPopupRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CompetitionComponent,
        CompetitionDetailComponent,
        CompetitionDialogComponent,
        CompetitionDeleteDialogComponent,
        CompetitionPopupComponent,
        CompetitionDeletePopupComponent,
    ],
    entryComponents: [
        CompetitionComponent,
        CompetitionDialogComponent,
        CompetitionPopupComponent,
        CompetitionDeleteDialogComponent,
        CompetitionDeletePopupComponent,
    ],
    providers: [
        CompetitionService,
        CompetitionPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsCompetitionModule {}
