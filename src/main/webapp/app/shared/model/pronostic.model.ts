import { IMatch } from 'app/shared/model/match.model';
import { IUser } from 'app/core/user/user.model';

export interface IPronostic {
  id?: number;
  scoreEquipeDomicile?: number;
  scoreEquipeVisiteur?: number;
  points?: number;
  match?: IMatch;
  utilisateur?: IUser;
}

export class Pronostic implements IPronostic {
  constructor(
    public id?: number,
    public scoreEquipeDomicile?: number,
    public scoreEquipeVisiteur?: number,
    public points?: number,
    public match?: IMatch,
    public utilisateur?: IUser
  ) {}
}
