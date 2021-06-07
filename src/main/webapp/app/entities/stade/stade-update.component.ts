import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IStade, Stade } from 'app/shared/model/stade.model';
import { StadeService } from './stade.service';
import { IPays } from 'app/shared/model/pays.model';
import { PaysService } from 'app/entities/pays/pays.service';

@Component({
  selector: 'jhi-stade-update',
  templateUrl: './stade-update.component.html',
})
export class StadeUpdateComponent implements OnInit {
  isSaving = false;
  pays: IPays[] = [];
  page: number;
  itemsPerPage: number;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    ville: [null, [Validators.required]],
    pays: [],
  });

  constructor(
    protected stadeService: StadeService,
    protected paysService: PaysService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.page = 0;
    this.itemsPerPage = 100;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stade }) => {
      this.updateForm(stade);

      this.paysService.query({page: this.page,
        size: this.itemsPerPage
      }).subscribe((res: HttpResponse<IPays[]>) => (this.pays = res.body || []));
    });
  }

  updateForm(stade: IStade): void {
    this.editForm.patchValue({
      id: stade.id,
      nom: stade.nom,
      ville: stade.ville,
      pays: stade.pays,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stade = this.createFromForm();
    if (stade.id !== undefined) {
      this.subscribeToSaveResponse(this.stadeService.update(stade));
    } else {
      this.subscribeToSaveResponse(this.stadeService.create(stade));
    }
  }

  private createFromForm(): IStade {
    return {
      ...new Stade(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      ville: this.editForm.get(['ville'])!.value,
      pays: this.editForm.get(['pays'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStade>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IPays): any {
    return item.id;
  }
}
