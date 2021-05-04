import { IPays } from 'app/shared/model/pays.model';
import { ICompetition } from 'app/shared/model/competition.model';

export interface IStade {
  id?: number;
  nom?: string;
  ville?: string;
  pays?: IPays;
  competitions?: ICompetition[];
}

export class Stade implements IStade {
  constructor(public id?: number, public nom?: string, public ville?: string, public pays?: IPays, public competitions?: ICompetition[]) {}
}
