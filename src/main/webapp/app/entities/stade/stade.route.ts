import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { StadeComponent } from './stade.component';
import { StadeDetailComponent } from './stade-detail.component';
import { StadePopupComponent } from './stade-dialog.component';
import { StadeDeletePopupComponent } from './stade-delete-dialog.component';

export const stadeRoute: Routes = [
    {
        path: 'stade',
        component: StadeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.stade.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'stade/:id',
        component: StadeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.stade.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const stadePopupRoute: Routes = [
    {
        path: 'stade-new',
        component: StadePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.stade.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'stade/:id/edit',
        component: StadePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.stade.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'stade/:id/delete',
        component: StadeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pronosticsApp.stade.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
