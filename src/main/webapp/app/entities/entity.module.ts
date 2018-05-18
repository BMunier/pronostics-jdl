import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PronosticsCompetitionModule } from './competition/competition.module';
import { PronosticsPaysModule } from './pays/pays.module';
import { PronosticsStadeModule } from './stade/stade.module';
import { PronosticsEquipeModule } from './equipe/equipe.module';
import { PronosticsMatchModule } from './match/match.module';
import { PronosticsPronosticModule } from './pronostic/pronostic.module';
import { PronosticsTotoModule } from './toto/toto.module';
import { PronosticsTutuModule } from './tutu/tutu.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        PronosticsCompetitionModule,
        PronosticsPaysModule,
        PronosticsStadeModule,
        PronosticsEquipeModule,
        PronosticsMatchModule,
        PronosticsPronosticModule,
        PronosticsTotoModule,
        PronosticsTutuModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronosticsEntityModule {}
