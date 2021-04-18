import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IPays, Pays } from 'app/shared/model/pays.model';
import { PaysService } from './pays.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-pays-update',
  templateUrl: './pays-update.component.html',
})
export class PaysUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    codeIso: [null, [Validators.required]],
    drapeau: [null, [Validators.required]],
    drapeauContentType: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected paysService: PaysService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pays }) => {
      this.updateForm(pays);
    });
  }

  updateForm(pays: IPays): void {
    this.editForm.patchValue({
      id: pays.id,
      nom: pays.nom,
      codeIso: pays.codeIso,
      drapeau: pays.drapeau,
      drapeauContentType: pays.drapeauContentType,
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
    const pays = this.createFromForm();
    if (pays.id !== undefined) {
      this.subscribeToSaveResponse(this.paysService.update(pays));
    } else {
      this.subscribeToSaveResponse(this.paysService.create(pays));
    }
  }

  private createFromForm(): IPays {
    return {
      ...new Pays(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      codeIso: this.editForm.get(['codeIso'])!.value,
      drapeauContentType: this.editForm.get(['drapeauContentType'])!.value,
      drapeau: this.editForm.get(['drapeau'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPays>>): void {
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
}
