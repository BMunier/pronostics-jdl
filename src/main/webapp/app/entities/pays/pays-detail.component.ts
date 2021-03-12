import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Pays } from './pays.model';
import { PaysService } from './pays.service';

@Component({
    selector: 'jhi-pays-detail',
    templateUrl: './pays-detail.component.html'
})
export class PaysDetailComponent implements OnInit, OnDestroy {

    pays: Pays;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private paysService: PaysService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPays();
    }

    load(id) {
        this.paysService.find(id)
            .subscribe((paysResponse: HttpResponse<Pays>) => {
                this.pays = paysResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPays() {
        this.eventSubscriber = this.eventManager.subscribe(
            'paysListModification',
            (response) => this.load(this.pays.id)
        );
    }
}
