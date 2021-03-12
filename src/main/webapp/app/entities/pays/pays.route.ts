import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaysComponent } from './pays.component';
import { PaysDetailComponent } from './pays-detail.component';
import { PaysPopupComponent } from './pays-dialog.component';
import { PaysDeletePopupComponent } from './pays-delete-dialog.component';

export const paysRoute: Routes = [
    {
        path: 'pays',
        component: PaysComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pays.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'pays/:id',
        component: PaysDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pays.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paysPopupRoute: Routes = [
    {
        path: 'pays-new',
        component: PaysPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pays.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'pays/:id/edit',
        component: PaysPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pays.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'pays/:id/delete',
        component: PaysDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.pays.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
