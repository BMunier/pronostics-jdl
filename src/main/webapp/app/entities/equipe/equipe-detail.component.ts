import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Equipe } from './equipe.model';
import { EquipeService } from './equipe.service';

@Component({
    selector: 'jhi-equipe-detail',
    templateUrl: './equipe-detail.component.html'
})
export class EquipeDetailComponent implements OnInit, OnDestroy {

    equipe: Equipe;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private equipeService: EquipeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEquipes();
    }

    load(id) {
        this.equipeService.find(id)
            .subscribe((equipeResponse: HttpResponse<Equipe>) => {
                this.equipe = equipeResponse.body;
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

    registerChangeInEquipes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'equipeListModification',
            (response) => this.load(this.equipe.id)
        );
    }
}
