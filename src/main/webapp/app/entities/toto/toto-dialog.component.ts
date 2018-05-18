import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Toto } from './toto.model';
import { TotoPopupService } from './toto-popup.service';
import { TotoService } from './toto.service';

@Component({
    selector: 'jhi-toto-dialog',
    templateUrl: './toto-dialog.component.html'
})
export class TotoDialogComponent implements OnInit {

    toto: Toto;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private totoService: TotoService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.toto.id !== undefined) {
            this.subscribeToSaveResponse(
                this.totoService.update(this.toto));
        } else {
            this.subscribeToSaveResponse(
                this.totoService.create(this.toto));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Toto>>) {
        result.subscribe((res: HttpResponse<Toto>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Toto) {
        this.eventManager.broadcast({ name: 'totoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-toto-popup',
    template: ''
})
export class TotoPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private totoPopupService: TotoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.totoPopupService
                    .open(TotoDialogComponent as Component, params['id']);
            } else {
                this.totoPopupService
                    .open(TotoDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
