import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CompetitionComponent } from './competition.component';
import { CompetitionDetailComponent } from './competition-detail.component';
import { CompetitionPopupComponent } from './competition-dialog.component';
import { CompetitionDeletePopupComponent } from './competition-delete-dialog.component';

export const competitionRoute: Routes = [
    {
        path: 'competition',
        component: CompetitionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.competition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'competition/:id',
        component: CompetitionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.competition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const competitionPopupRoute: Routes = [
    {
        path: 'competition-new',
        component: CompetitionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.competition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'competition/:id/edit',
        component: CompetitionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.competition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'competition/:id/delete',
        component: CompetitionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.competition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
