import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEquipe } from 'app/shared/model/equipe.model';
import { EquipeService } from './equipe.service';

@Component({
  templateUrl: './equipe-delete-dialog.component.html',
})
export class EquipeDeleteDialogComponent {
  equipe?: IEquipe;

  constructor(protected equipeService: EquipeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.equipeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('equipeListModification');
      this.activeModal.close();
    });
  }
}
