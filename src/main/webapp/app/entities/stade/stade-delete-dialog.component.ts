import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IStade } from 'app/shared/model/stade.model';
import { StadeService } from './stade.service';

@Component({
  templateUrl: './stade-delete-dialog.component.html',
})
export class StadeDeleteDialogComponent {
  stade?: IStade;

  constructor(protected stadeService: StadeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stadeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('stadeListModification');
      this.activeModal.close();
    });
  }
}
