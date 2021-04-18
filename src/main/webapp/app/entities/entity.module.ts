import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'competition',
        loadChildren: () => import('./competition/competition.module').then(m => m.PronosticsCompetitionModule),
      },
      {
        path: 'pays',
        loadChildren: () => import('./pays/pays.module').then(m => m.PronosticsPaysModule),
      },
      {
        path: 'stade',
        loadChildren: () => import('./stade/stade.module').then(m => m.PronosticsStadeModule),
      },
      {
        path: 'equipe',
        loadChildren: () => import('./equipe/equipe.module').then(m => m.PronosticsEquipeModule),
      },
      {
        path: 'match',
        loadChildren: () => import('./match/match.module').then(m => m.PronosticsMatchModule),
      },
      {
        path: 'pronostic',
        loadChildren: () => import('./pronostic/pronostic.module').then(m => m.PronosticsPronosticModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class PronosticsEntityModule {}
