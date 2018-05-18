import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Tutu } from './tutu.model';
import { TutuPopupService } from './tutu-popup.service';
import { TutuService } from './tutu.service';

@Component({
    selector: 'jhi-tutu-delete-dialog',
    templateUrl: './tutu-delete-dialog.component.html'
})
export class TutuDeleteDialogComponent {

    tutu: Tutu;

    constructor(
        private tutuService: TutuService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.tutuService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'tutuListModification',
                content: 'Deleted an tutu'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-tutu-delete-popup',
    template: ''
})
export class TutuDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tutuPopupService: TutuPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.tutuPopupService
                .open(TutuDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
