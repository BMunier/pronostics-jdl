import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICompetition, Competition } from 'app/shared/model/competition.model';
import { CompetitionService } from './competition.service';
import { IEquipe } from 'app/shared/model/equipe.model';
import { EquipeService } from 'app/entities/equipe/equipe.service';
import { IPays } from 'app/shared/model/pays.model';
import { PaysService } from 'app/entities/pays/pays.service';
import { IStade } from 'app/shared/model/stade.model';
import { StadeService } from 'app/entities/stade/stade.service';

type SelectableEntity = IEquipe | IPays | IStade;

@Component({
  selector: 'jhi-competition-update',
  templateUrl: './competition-update.component.html',
})
export class CompetitionUpdateComponent implements OnInit {
  isSaving = false;
  equipes: IEquipe[] = [];
  pays: IPays[] = [];
  stades: IStade[] = [];
  dateDebutDp: any;
  dateFinDp: any;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    equipes: [],
    pays: [],
    stades: [],
  });

  constructor(
    protected competitionService: CompetitionService,
    protected equipeService: EquipeService,
    protected paysService: PaysService,
    protected stadeService: StadeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ competition }) => {
      this.updateForm(competition);

      this.equipeService.query().subscribe((res: HttpResponse<IEquipe[]>) => (this.equipes = res.body || []));

      this.paysService.query().subscribe((res: HttpResponse<IPays[]>) => (this.pays = res.body || []));

      this.stadeService.query().subscribe((res: HttpResponse<IStade[]>) => (this.stades = res.body || []));
    });
  }

  updateForm(competition: ICompetition): void {
    this.editForm.patchValue({
      id: competition.id,
      nom: competition.nom,
      description: competition.description,
      dateDebut: competition.dateDebut,
      dateFin: competition.dateFin,
      equipes: competition.equipes,
      pays: competition.pays,
      stades: competition.stades,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const competition = this.createFromForm();
    if (competition.id !== undefined) {
      this.subscribeToSaveResponse(this.competitionService.update(competition));
    } else {
      this.subscribeToSaveResponse(this.competitionService.create(competition));
    }
  }

  private createFromForm(): ICompetition {
    return {
      ...new Competition(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
      equipes: this.editForm.get(['equipes'])!.value,
      pays: this.editForm.get(['pays'])!.value,
      stades: this.editForm.get(['stades'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompetition>>): void {
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

  getSelected(selectedVals: SelectableEntity[], option: SelectableEntity): SelectableEntity {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
