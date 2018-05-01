import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Pronostic } from './pronostic.model';
import { PronosticPopupService } from './pronostic-popup.service';
import { PronosticService } from './pronostic.service';

@Component({
    selector: 'jhi-pronostic-delete-dialog',
    templateUrl: './pronostic-delete-dialog.component.html'
})
export class PronosticDeleteDialogComponent {

    pronostic: Pronostic;

    constructor(
        private pronosticService: PronosticService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pronosticService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'pronosticListModification',
                content: 'Deleted an pronostic'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-pronostic-delete-popup',
    template: ''
})
export class PronosticDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pronosticPopupService: PronosticPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.pronosticPopupService
                .open(PronosticDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
