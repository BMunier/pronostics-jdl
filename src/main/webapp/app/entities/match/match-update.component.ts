import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IMatch, Match } from 'app/shared/model/match.model';
import { MatchService } from './match.service';
import { ICompetition } from 'app/shared/model/competition.model';
import { CompetitionService } from 'app/entities/competition/competition.service';
import { IStade } from 'app/shared/model/stade.model';
import { StadeService } from 'app/entities/stade/stade.service';
import { IEquipe } from 'app/shared/model/equipe.model';
import { EquipeService } from 'app/entities/equipe/equipe.service';

type SelectableEntity = ICompetition | IStade | IEquipe;

@Component({
  selector: 'jhi-match-update',
  templateUrl: './match-update.component.html',
})
export class MatchUpdateComponent implements OnInit {
  isSaving = false;
  competitions: ICompetition[] = [];
  stades: IStade[] = [];
  equipes: IEquipe[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    statut: [null, [Validators.required]],
    code: [],
    scoreEquipeDomicile: [],
    scoreEquipeVisiteur: [],
    phaseCompetition: [],
    groupe: [],
    competition: [],
    stade: [],
    equipeDomicile: [],
    equipeVisiteur: [],
  });

  constructor(
    protected matchService: MatchService,
    protected competitionService: CompetitionService,
    protected stadeService: StadeService,
    protected equipeService: EquipeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ match }) => {
      if (!match.id) {
        const today = moment().startOf('day');
        match.date = today;
      }

      this.updateForm(match);

      this.competitionService.query().subscribe((res: HttpResponse<ICompetition[]>) => (this.competitions = res.body || []));

      this.stadeService.query().subscribe((res: HttpResponse<IStade[]>) => (this.stades = res.body || []));

      this.equipeService.query().subscribe((res: HttpResponse<IEquipe[]>) => (this.equipes = res.body || []));
    });
  }

  updateForm(match: IMatch): void {
    this.editForm.patchValue({
      id: match.id,
      date: match.date ? match.date.format(DATE_TIME_FORMAT) : null,
      statut: match.statut,
      code: match.code,
      scoreEquipeDomicile: match.scoreEquipeDomicile,
      scoreEquipeVisiteur: match.scoreEquipeVisiteur,
      phaseCompetition: match.phaseCompetition,
      groupe: match.groupe,
      competition: match.competition,
      stade: match.stade,
      equipeDomicile: match.equipeDomicile,
      equipeVisiteur: match.equipeVisiteur,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const match = this.createFromForm();
    if (match.id !== undefined) {
      this.subscribeToSaveResponse(this.matchService.update(match));
    } else {
      this.subscribeToSaveResponse(this.matchService.create(match));
    }
  }

  private createFromForm(): IMatch {
    return {
      ...new Match(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      statut: this.editForm.get(['statut'])!.value,
      code: this.editForm.get(['code'])!.value,
      scoreEquipeDomicile: this.editForm.get(['scoreEquipeDomicile'])!.value,
      scoreEquipeVisiteur: this.editForm.get(['scoreEquipeVisiteur'])!.value,
      phaseCompetition: this.editForm.get(['phaseCompetition'])!.value,
      groupe: this.editForm.get(['groupe'])!.value,
      competition: this.editForm.get(['competition'])!.value,
      stade: this.editForm.get(['stade'])!.value,
      equipeDomicile: this.editForm.get(['equipeDomicile'])!.value,
      equipeVisiteur: this.editForm.get(['equipeVisiteur'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatch>>): void {
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
