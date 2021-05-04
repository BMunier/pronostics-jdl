import { User } from "app/core/user/user.model";
import { Match } from "app/shared/model/match.model";
import { IPronostic } from "app/shared/model/pronostic.model";

export class PronosticSaisie implements IPronostic {
    constructor(
        public id?: number,
        public scoreEquipeDomicile?: number,
        public scoreEquipeVisiteur?: number,
        public points?: number,
        public match?: Match,
        public utilisateur?: User,
        public updated?:boolean
    ) {
    }
}
