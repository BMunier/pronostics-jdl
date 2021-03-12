import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Equipe } from './equipe.model';
import { EquipePopupService } from './equipe-popup.service';
import { EquipeService } from './equipe.service';

@Component({
    selector: 'jhi-equipe-delete-dialog',
    templateUrl: './equipe-delete-dialog.component.html'
})
export class EquipeDeleteDialogComponent {

    equipe: Equipe;

    constructor(
        private equipeService: EquipeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.equipeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'equipeListModification',
                content: 'Deleted an equipe'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-equipe-delete-popup',
    template: ''
})
export class EquipeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private equipePopupService: EquipePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.equipePopupService
                .open(EquipeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
