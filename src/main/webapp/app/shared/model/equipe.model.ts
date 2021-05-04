import { IPays } from 'app/shared/model/pays.model';
import { ICompetition } from 'app/shared/model/competition.model';

export interface IEquipe {
  id?: number;
  codeEquipe?: string;
  nomEquipe?: string;
  rangFifa?: number;
  ecussonContentType?: string;
  ecusson?: any;
  pays?: IPays;
  competitions?: ICompetition[];
}

export class Equipe implements IEquipe {
  constructor(
    public id?: number,
    public codeEquipe?: string,
    public nomEquipe?: string,
    public rangFifa?: number,
    public ecussonContentType?: string,
    public ecusson?: any,
    public pays?: IPays,
    public competitions?: ICompetition[]
  ) {}
}
