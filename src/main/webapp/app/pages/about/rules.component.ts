import { Component, OnInit, OnDestroy } from '@angular/core';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { RulesService } from './rules.service';

@Component({
    selector: 'jhi-rules',
    templateUrl: './rules.component.html'
})
export class RulesComponent implements OnInit, OnDestroy {

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
        private rulesService: RulesService,
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
