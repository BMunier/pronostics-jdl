import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Toto } from './toto.model';
import { TotoPopupService } from './toto-popup.service';
import { TotoService } from './toto.service';

@Component({
    selector: 'jhi-toto-delete-dialog',
    templateUrl: './toto-delete-dialog.component.html'
})
export class TotoDeleteDialogComponent {

    toto: Toto;

    constructor(
        private totoService: TotoService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.totoService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'totoListModification',
                content: 'Deleted an toto'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-toto-delete-popup',
    template: ''
})
export class TotoDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private totoPopupService: TotoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.totoPopupService
                .open(TotoDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
