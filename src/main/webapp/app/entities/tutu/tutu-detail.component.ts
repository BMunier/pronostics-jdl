import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Tutu } from './tutu.model';
import { TutuService } from './tutu.service';

@Component({
    selector: 'jhi-tutu-detail',
    templateUrl: './tutu-detail.component.html'
})
export class TutuDetailComponent implements OnInit, OnDestroy {

    tutu: Tutu;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private tutuService: TutuService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTutus();
    }

    load(id) {
        this.tutuService.find(id)
            .subscribe((tutuResponse: HttpResponse<Tutu>) => {
                this.tutu = tutuResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTutus() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tutuListModification',
            (response) => this.load(this.tutu.id)
        );
    }
}
