import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Toto } from './toto.model';
import { TotoService } from './toto.service';

@Component({
    selector: 'jhi-toto-detail',
    templateUrl: './toto-detail.component.html'
})
export class TotoDetailComponent implements OnInit, OnDestroy {

    toto: Toto;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private totoService: TotoService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTotos();
    }

    load(id) {
        this.totoService.find(id)
            .subscribe((totoResponse: HttpResponse<Toto>) => {
                this.toto = totoResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTotos() {
        this.eventSubscriber = this.eventManager.subscribe(
            'totoListModification',
            (response) => this.load(this.toto.id)
        );
    }
}
