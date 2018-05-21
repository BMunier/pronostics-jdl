import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Stade } from './stade.model';
import { StadePopupService } from './stade-popup.service';
import { StadeService } from './stade.service';
import { Pays, PaysService } from '../pays';

@Component({
    selector: 'jhi-stade-dialog',
    templateUrl: './stade-dialog.component.html'
})
export class StadeDialogComponent implements OnInit {

    stade: Stade;
    isSaving: boolean;

    pays: Pays[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private stadeService: StadeService,
        private paysService: PaysService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.paysService.query()
            .subscribe((res: HttpResponse<Pays[]>) => { this.pays = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.stade.id !== undefined) {
            this.subscribeToSaveResponse(
                this.stadeService.update(this.stade));
        } else {
            this.subscribeToSaveResponse(
                this.stadeService.create(this.stade));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Stade>>) {
        result.subscribe((res: HttpResponse<Stade>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Stade) {
        this.eventManager.broadcast({ name: 'stadeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackPaysById(index: number, item: Pays) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-stade-popup',
    template: ''
})
export class StadePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private stadePopupService: StadePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.stadePopupService
                    .open(StadeDialogComponent as Component, params['id']);
            } else {
                this.stadePopupService
                    .open(StadeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
