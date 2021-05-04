import { Moment } from 'moment';
import { IEquipe } from 'app/shared/model/equipe.model';
import { IPays } from 'app/shared/model/pays.model';
import { IStade } from 'app/shared/model/stade.model';

export interface ICompetition {
  id?: number;
  nom?: string;
  description?: string;
  dateDebut?: Moment;
  dateFin?: Moment;
  equipes?: IEquipe[];
  pays?: IPays[];
  stades?: IStade[];
}

export class Competition implements ICompetition {
  constructor(
    public id?: number,
    public nom?: string,
    public description?: string,
    public dateDebut?: Moment,
    public dateFin?: Moment,
    public equipes?: IEquipe[],
    public pays?: IPays[],
    public stades?: IStade[]
  ) {}
}
