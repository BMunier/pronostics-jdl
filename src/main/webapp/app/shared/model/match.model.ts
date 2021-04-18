import { Moment } from 'moment';
import { ICompetition } from 'app/shared/model/competition.model';
import { IStade } from 'app/shared/model/stade.model';
import { IEquipe } from 'app/shared/model/equipe.model';
import { StatutMatch } from 'app/shared/model/enumerations/statut-match.model';
import { PhaseCompetition } from 'app/shared/model/enumerations/phase-competition.model';

export interface IMatch {
  id?: number;
  date?: Moment;
  statut?: StatutMatch;
  code?: string;
  scoreEquipeDomicile?: number;
  scoreEquipeVisiteur?: number;
  phaseCompetition?: PhaseCompetition;
  groupe?: string;
  competition?: ICompetition;
  stade?: IStade;
  equipeDomicile?: IEquipe;
  equipeVisiteur?: IEquipe;
}

export class Match implements IMatch {
  constructor(
    public id?: number,
    public date?: Moment,
    public statut?: StatutMatch,
    public code?: string,
    public scoreEquipeDomicile?: number,
    public scoreEquipeVisiteur?: number,
    public phaseCompetition?: PhaseCompetition,
    public groupe?: string,
    public competition?: ICompetition,
    public stade?: IStade,
    public equipeDomicile?: IEquipe,
    public equipeVisiteur?: IEquipe
  ) {}
}
