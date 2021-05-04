import { Component, OnInit, OnDestroy } from '@angular/core';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { About } from './about.model';
import { AboutService } from './about.service';
// import { Principal } from '../../shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'jhi-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, OnDestroy {

    currentAccount: any;
    // eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private aboutService: AboutService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        // private principal: Principal
    ) {
    }

    ngOnInit(): void {

/*         this.principal.identity().then((account: any) => {
            this.currentAccount = account;
        }); */

    }

    ngOnDestroy(): void {

    }

    sort(): any {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }
    private onError(error: any): void {
        this.jhiAlertService.error(error.message, null, undefined);
    }
}
