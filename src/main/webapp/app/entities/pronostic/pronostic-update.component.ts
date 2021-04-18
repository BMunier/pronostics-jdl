import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPronostic, Pronostic } from 'app/shared/model/pronostic.model';
import { PronosticService } from './pronostic.service';
import { IMatch } from 'app/shared/model/match.model';
import { MatchService } from 'app/entities/match/match.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

type SelectableEntity = IMatch | IUser;

@Component({
  selector: 'jhi-pronostic-update',
  templateUrl: './pronostic-update.component.html',
})
export class PronosticUpdateComponent implements OnInit {
  isSaving = false;
  matches: IMatch[] = [];
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    scoreEquipeDomicile: [null, [Validators.required]],
    scoreEquipeVisiteur: [null, [Validators.required]],
    points: [],
    match: [],
    utilisateur: [],
  });

  constructor(
    protected pronosticService: PronosticService,
    protected matchService: MatchService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pronostic }) => {
      this.updateForm(pronostic);

      this.matchService.query().subscribe((res: HttpResponse<IMatch[]>) => (this.matches = res.body || []));

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(pronostic: IPronostic): void {
    this.editForm.patchValue({
      id: pronostic.id,
      scoreEquipeDomicile: pronostic.scoreEquipeDomicile,
      scoreEquipeVisiteur: pronostic.scoreEquipeVisiteur,
      points: pronostic.points,
      match: pronostic.match,
      utilisateur: pronostic.utilisateur,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pronostic = this.createFromForm();
    if (pronostic.id !== undefined) {
      this.subscribeToSaveResponse(this.pronosticService.update(pronostic));
    } else {
      this.subscribeToSaveResponse(this.pronosticService.create(pronostic));
    }
  }

  private createFromForm(): IPronostic {
    return {
      ...new Pronostic(),
      id: this.editForm.get(['id'])!.value,
      scoreEquipeDomicile: this.editForm.get(['scoreEquipeDomicile'])!.value,
      scoreEquipeVisiteur: this.editForm.get(['scoreEquipeVisiteur'])!.value,
      points: this.editForm.get(['points'])!.value,
      match: this.editForm.get(['match'])!.value,
      utilisateur: this.editForm.get(['utilisateur'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPronostic>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
