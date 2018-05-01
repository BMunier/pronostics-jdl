import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PronosticComponent } from './pronostic.component';
import { PronosticDetailComponent } from './pronostic-detail.component';
import { PronosticPopupComponent } from './pronostic-dialog.component';
import { PronosticDeletePopupComponent } from './pronostic-delete-dialog.component';

export const pronosticRoute: Routes = [
    {
        path: 'pronostic',
        component: PronosticComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pronostic.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'pronostic/:id',
        component: PronosticDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pronostic.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const pronosticPopupRoute: Routes = [
    {
        path: 'pronostic-new',
        component: PronosticPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pronostic.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'pronostic/:id/edit',
        component: PronosticPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pronostic.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'pronostic/:id/delete',
        component: PronosticDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pronostic.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
