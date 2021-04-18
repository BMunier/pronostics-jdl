import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IEquipe, Equipe } from 'app/shared/model/equipe.model';
import { EquipeService } from './equipe.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IPays } from 'app/shared/model/pays.model';
import { PaysService } from 'app/entities/pays/pays.service';

@Component({
  selector: 'jhi-equipe-update',
  templateUrl: './equipe-update.component.html',
})
export class EquipeUpdateComponent implements OnInit {
  isSaving = false;
  pays: IPays[] = [];

  editForm = this.fb.group({
    id: [],
    codeEquipe: [],
    nomEquipe: [],
    rangFifa: [],
    ecusson: [null, [Validators.required]],
    ecussonContentType: [],
    pays: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected equipeService: EquipeService,
    protected paysService: PaysService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipe }) => {
      this.updateForm(equipe);

      this.paysService.query().subscribe((res: HttpResponse<IPays[]>) => (this.pays = res.body || []));
    });
  }

  updateForm(equipe: IEquipe): void {
    this.editForm.patchValue({
      id: equipe.id,
      codeEquipe: equipe.codeEquipe,
      nomEquipe: equipe.nomEquipe,
      rangFifa: equipe.rangFifa,
      ecusson: equipe.ecusson,
      ecussonContentType: equipe.ecussonContentType,
      pays: equipe.pays,
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: any, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('pronosticsApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const equipe = this.createFromForm();
    if (equipe.id !== undefined) {
      this.subscribeToSaveResponse(this.equipeService.update(equipe));
    } else {
      this.subscribeToSaveResponse(this.equipeService.create(equipe));
    }
  }

  private createFromForm(): IEquipe {
    return {
      ...new Equipe(),
      id: this.editForm.get(['id'])!.value,
      codeEquipe: this.editForm.get(['codeEquipe'])!.value,
      nomEquipe: this.editForm.get(['nomEquipe'])!.value,
      rangFifa: this.editForm.get(['rangFifa'])!.value,
      ecussonContentType: this.editForm.get(['ecussonContentType'])!.value,
      ecusson: this.editForm.get(['ecusson'])!.value,
      pays: this.editForm.get(['pays'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEquipe>>): void {
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
