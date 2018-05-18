import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Tutu } from './tutu.model';
import { TutuPopupService } from './tutu-popup.service';
import { TutuService } from './tutu.service';
import { Toto, TotoService } from '../toto';

@Component({
    selector: 'jhi-tutu-dialog',
    templateUrl: './tutu-dialog.component.html'
})
export class TutuDialogComponent implements OnInit {

    tutu: Tutu;
    isSaving: boolean;

    totos: Toto[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private tutuService: TutuService,
        private totoService: TotoService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.totoService
            .query({filter: 'tutu-is-null'})
            .subscribe((res: HttpResponse<Toto[]>) => {
                if (!this.tutu.toto || !this.tutu.toto.id) {
                    this.totos = res.body;
                } else {
                    this.totoService
                        .find(this.tutu.toto.id)
                        .subscribe((subRes: HttpResponse<Toto>) => {
                            this.totos = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.tutu.id !== undefined) {
            this.subscribeToSaveResponse(
                this.tutuService.update(this.tutu));
        } else {
            this.subscribeToSaveResponse(
                this.tutuService.create(this.tutu));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Tutu>>) {
        result.subscribe((res: HttpResponse<Tutu>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Tutu) {
        this.eventManager.broadcast({ name: 'tutuListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackTotoById(index: number, item: Toto) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-tutu-popup',
    template: ''
})
export class TutuPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tutuPopupService: TutuPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.tutuPopupService
                    .open(TutuDialogComponent as Component, params['id']);
            } else {
                this.tutuPopupService
                    .open(TutuDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
