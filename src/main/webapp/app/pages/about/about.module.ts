import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PronosticsSharedModule } from 'app/shared/shared.module';

import {
    AboutService,
    AboutComponent,
    RulesService,
    RulesComponent,
    AboutRoute,
} from './';

const PAGE_SET_STATES = [
    ...AboutRoute,
];

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forRoot(PAGE_SET_STATES, { useHash: true })
    ],
    declarations: [
    AboutComponent,
    RulesComponent,
],
    entryComponents: [
    AboutComponent,
    RulesComponent,
],
    providers: [
    AboutService,
    RulesService,
],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PronosticsAboutModule {}
