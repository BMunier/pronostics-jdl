import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { EquipeComponent } from './equipe.component';
import { EquipeDetailComponent } from './equipe-detail.component';
import { EquipePopupComponent } from './equipe-dialog.component';
import { EquipeDeletePopupComponent } from './equipe-delete-dialog.component';

export const equipeRoute: Routes = [
    {
        path: 'equipe',
        component: EquipeComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'pronosticsApp.equipe.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'equipe/:id',
        component: EquipeDetailComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'pronosticsApp.equipe.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const equipePopupRoute: Routes = [
    {
        path: 'equipe-new',
        component: EquipePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'pronosticsApp.equipe.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'equipe/:id/edit',
        component: EquipePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'pronosticsApp.equipe.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'equipe/:id/delete',
        component: EquipeDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'pronosticsApp.equipe.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
