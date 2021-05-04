import { ICompetition } from 'app/shared/model/competition.model';

export interface IPays {
  id?: number;
  nom?: string;
  codeIso?: string;
  drapeauContentType?: string;
  drapeau?: any;
  competitions?: ICompetition[];
}

export class Pays implements IPays {
  constructor(
    public id?: number,
    public nom?: string,
    public codeIso?: string,
    public drapeauContentType?: string,
    public drapeau?: any,
    public competitions?: ICompetition[]
  ) {}
}
