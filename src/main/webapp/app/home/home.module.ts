import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PronosticsSharedModule } from '../shared';
import {PronosticSaisieService} from './pronostic-saisie/pronostic-saisie.service'
import {ClassementService} from './classement/classement.service'


import { HOME_ROUTE, HomeComponent} from './';
import { PronosticSaisieComponent } from './pronostic-saisie/pronostic-saisie.component';
import { ClassementComponent } from './classement/classement.component';

@NgModule({
    imports: [
        PronosticsSharedModule,
        RouterModule.forChild([ HOME_ROUTE ])
    ],
    declarations: [
        HomeComponent, PronosticSaisieComponent, ClassementComponent
    ],
    entryComponents: [
    ],
    providers: [
        PronosticSaisieService,ClassementService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsHomeModule {}
